import type {
  CreateOrderRequest,
  NoticeAcceptanceMap,
  QuantityMap,
  SaleResponse,
  SelectedOrderItem,
} from '@/feature/commerce/types';

export function isClosedSale(closesAt: string) {
  const closesAtTime = new Date(closesAt).getTime();

  return Number.isFinite(closesAtTime) && closesAtTime <= Date.now();
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

export function getNoticeAcceptances(
  sale: SaleResponse,
  noticeAcceptanceMap: NoticeAcceptanceMap
): CreateOrderRequest['noticeAcceptances'] {
  return sale.notices.map((notice) => ({
    noticeId: notice.noticeId,
    version: notice.version,
    accepted: Boolean(noticeAcceptanceMap[notice.noticeId]),
  }));
}

export function areRequiredNoticesAccepted(
  sale: SaleResponse,
  noticeAcceptanceMap: NoticeAcceptanceMap
) {
  return sale.notices.every(
    (notice) =>
      !notice.required || noticeAcceptanceMap[notice.noticeId] === true
  );
}

export function isContactSharingConsentAccepted(
  sale: SaleResponse,
  noticeAcceptanceMap: NoticeAcceptanceMap
) {
  const consentNotices = sale.notices.filter(
    (notice) => notice.type === 'SYSTEM_PRIVACY_CONSENT'
  );

  return (
    consentNotices.length > 0 &&
    consentNotices.every(
      (notice) => noticeAcceptanceMap[notice.noticeId] === true
    )
  );
}

export function getCreateOrderRequestSignature(
  request: Pick<
    CreateOrderRequest,
    | 'saleId'
    | 'buyerContact'
    | 'contactSharingConsent'
    | 'noticeAcceptances'
    | 'items'
  >
) {
  return JSON.stringify(request);
}
