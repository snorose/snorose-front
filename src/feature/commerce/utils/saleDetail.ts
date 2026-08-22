import type {
  CreateOrderRequest,
  QuantityMap,
  Sale,
  SelectedOrderItem,
} from '@/feature/commerce/types';

export function isClosedSale(closesAt: string) {
  const closesAtTime = new Date(closesAt).getTime();

  return Number.isFinite(closesAtTime) && closesAtTime <= Date.now();
}

export function getTotalPaymentAmount(sale: Sale, quantityMap: QuantityMap) {
  return sale.products.reduce(
    (saleTotal, product) =>
      saleTotal +
      product.variants.reduce((productTotal, variant) => {
        const quantity =
          quantityMap[product.productId]?.[variant.variantId] ?? 0;

        return productTotal + variant.unitPrice * quantity;
      }, 0),
    0
  );
}

export function hasSelectedOrderItem(quantityMap: QuantityMap) {
  return Object.values(quantityMap).some((productQuantities) =>
    Object.values(productQuantities ?? {}).some((quantity) => quantity > 0)
  );
}

export function getSelectedOrderItems(
  sale: Sale,
  quantityMap: QuantityMap
): SelectedOrderItem[] {
  return sale.products
    .flatMap((product) =>
      product.variants.map((variant) => {
        const quantity =
          quantityMap[product.productId]?.[variant.variantId] ?? 0;

        return {
          product,
          variant,
          quantity,
        };
      })
    )
    .filter(({ quantity }) => quantity > 0);
}

export function getCreateOrderItems(
  selectedOrderItems: SelectedOrderItem[]
): CreateOrderRequest['items'] {
  return selectedOrderItems.map(({ variant, quantity }) => ({
    variantId: variant.variantId,
    quantity,
  }));
}

export function getCreateOrderRequestSignature(
  request: Pick<CreateOrderRequest, 'saleId' | 'buyerContact' | 'items'>
) {
  return JSON.stringify(request);
}
