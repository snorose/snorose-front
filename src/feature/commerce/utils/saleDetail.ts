import type {
  CreateOrderRequest,
  QuantityMap,
  SaleResponse,
  SelectedOrderItem,
} from '@/feature/commerce/types';

export function isSaleOrderable(sale: SaleResponse) {
  return sale.orderable === true;
}

export function getSaleUnavailableTitle(sale: SaleResponse) {
  if (sale.status === 'CLOSE') {
    return '판매가 마감되었어요';
  }

  return '지금은 주문할 수 없어요';
}

export function getSaleUnavailableMessage(sale: SaleResponse) {
  if (sale.status === 'CLOSE') {
    return '이 상품은 새 주문을 받을 수 없어요. 기존 주문과 수령 안내는 판매자의 공지를 확인해주세요.';
  }

  return '현재 이 판매는 새 주문을 받을 수 없어요.';
}

export function isLimitedStockProduct(
  product: SaleResponse['products'][number]
) {
  return product.inventoryPolicy === 'LIMITED_STOCK';
}

export function isVariantSoldOut(
  product: SaleResponse['products'][number],
  variant: SaleResponse['products'][number]['variants'][number]
) {
  if (variant.available === false) {
    return true;
  }

  return isLimitedStockProduct(product) && variant.availableQuantity === 0;
}

export function getTotalPaymentAmount(
  sale: SaleResponse,
  quantityMap: QuantityMap
) {
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
  sale: SaleResponse,
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
