import axios from 'axios';

import type {
  QuantityMap,
  SaleResponse,
  SelectedOrderItem,
} from '@/feature/commerce/types';

export function getSelectedOrderItems(
  products: SaleResponse['products'],
  quantityMap: QuantityMap
): SelectedOrderItem[] {
  return products
    .flatMap((product) =>
      product.variants.map((variant) => {
        const quantity =
          quantityMap[product.productId]?.[variant.variantId] ?? 0;

        return {
          productId: product.productId,
          productName: product.name,
          inventoryPolicy: product.inventoryPolicy,
          variantId: variant.variantId,
          optionLabel: variant.optionLabel,
          unitPrice: variant.unitPrice,
          availableQuantity: variant.availableQuantity,
          quantity,
        };
      })
    )
    .filter(({ quantity }) => quantity > 0);
}

export function isPlusQuantityInvalid(
  product: SaleResponse['products'][number],
  variant: SaleResponse['products'][number]['variants'][number],
  quantityMap: QuantityMap
) {
  const quantity = quantityMap[product.productId][variant.variantId];

  return (
    product.inventoryPolicy === 'LIMITED_STOCK' &&
    (quantity >= variant.availableQuantity ||
      isProductQuantityLimitReached(product, quantityMap))
  );
}

type ProductQuantityLimit = Pick<
  SaleResponse['products'][number],
  'productId' | 'remainingForBuyer'
>;

export function isProductQuantityLimitReached(
  product: ProductQuantityLimit,
  quantityMap: QuantityMap
) {
  const draftProductQuantity = Object.values(
    quantityMap[product.productId] ?? {}
  ).reduce((acc, quantity) => acc + quantity, 0);

  return draftProductQuantity >= product.remainingForBuyer;
}

export function isValidPhoneNumber(value: string) {
  return /^010\d{8}$/.test(value);
}

export function getSaleUnavailableTitle(sale: SaleResponse) {
  if (sale.status === 'CLOSED') {
    return '판매가 마감되었어요';
  }

  return '지금은 주문할 수 없어요';
}

export function getSaleUnavailableMessage(sale: SaleResponse) {
  if (sale.status === 'CLOSED') {
    return '이 상품은 새 주문을 받을 수 없어요. 기존 주문과 수령 안내는 판매자의 공지를 확인해주세요.';
  }

  return '현재 이 판매는 새 주문을 받을 수 없어요.';
}

export function getCommerceErrorCode(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  const code = error.response?.data?.code;

  if (typeof code !== 'string' && typeof code !== 'number') {
    return undefined;
  }

  return Number(code);
}
