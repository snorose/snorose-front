import {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
} from '@/feature/commerce/types';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  ACTIVE: '주문 활성',
  CANCELED: '주문 취소',
  COMPLETED: '주문 완료',
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  WAITING: '입금 대기',
  PAID: '입금 완료',
  REVIEW_REQUIRED: '확인 필요',
  EXPIRED: '입금 만료',
};

export const FULFILLMENT_STATUS_LABEL: Record<FulfillmentStatus, string> = {
  PENDING: '수령 대기',
  PICKED_UP: '수령 완료',
};
