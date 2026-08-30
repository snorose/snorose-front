import { Chip } from '@/shared/component';
import { formatNumber } from '@/shared/lib';

import {
  FULFILLMENT_STATUS_LABEL,
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
} from '@/feature/commerce/constants';
import { OrdersResponse } from '@/feature/commerce/types';

import styles from '@/page/commerce/OrderListPage.module.css';

import altImage from '@/assets/images/altImage.png';

export default function OrderItem({
  orderNumber,
  saleTitle,
  thumbnailUrl,
  itemSummary,
  totalAmount,
  orderStatus,
  paymentStatus,
  fulfillmentStatus,
}: Omit<
  OrdersResponse['data'][number],
  'saleId' | 'paymentDueAt' | 'createAt'
>) {
  const isPaymentPending =
    orderStatus === 'ACTIVE' &&
    paymentStatus === 'WAITING' &&
    fulfillmentStatus === 'PENDING';
  const isPickUpPending =
    orderStatus === 'ACTIVE' &&
    paymentStatus === 'PAID' &&
    fulfillmentStatus === 'PENDING';

  const isPickedUp =
    orderStatus === 'COMPLETED' &&
    paymentStatus === 'PAID' &&
    fulfillmentStatus === 'PICKED_UP';

  const isReview = paymentStatus === 'REVIEW_REQUIRED';

  const isCanceled =
    orderStatus === 'CANCELLED' && paymentStatus === 'CANCELLED';

  const isExpired = orderStatus === 'CANCELLED' && paymentStatus === 'EXPIRED';

  return (
    <div className={styles.orderItem}>
      <div className={styles.thumbnailWrapper}>
        <img
          className={styles.thumbnail}
          src={thumbnailUrl}
          onError={(e) => (e.currentTarget.src = altImage)}
          alt={`${saleTitle}의 내 주문`}
        />
      </div>
      <div className={styles.orderContent}>
        <div className={styles.orderTitle}>{saleTitle}</div>
        <div className={styles.orderMeta}>
          <span className={styles.orderNumber}>{orderNumber}</span>
          <div>
            <span>{itemSummary}</span>
            <span aria-hidden='true'>·</span>
            <span>{formatNumber(totalAmount)}원</span>
          </div>
        </div>
        <div className={styles.statusList}>
          {isPaymentPending && (
            <Chip name={'입금 대기'} variant={'gradient'} size='sm' />
          )}
          {isPickUpPending && (
            <Chip name={'수령 대기'} variant={'gradient'} size='sm' />
          )}
          {isPickedUp && <Chip name={'수령 완료'} variant={'grey'} size='sm' />}
          {isReview && (
            <Chip name={'운영자 확인'} variant={'gradient'} size='sm' />
          )}
          {isCanceled && <Chip name={'주문 취소'} variant={'grey'} size='sm' />}
          {isExpired && <Chip name={'입금 만료'} variant={'grey'} size='sm' />}
        </div>
      </div>
    </div>
  );
}

// 1. ACTIVE | WAITING | PENDING (입금 대기)
// 2. ACTIVE | PAID | PENDIGN (수령 대기)
// 3. ACTIVE | PAID | PICKUP (수령 완료)
// 4. ACTIVE | REVIEW_REQUIRED | PENDING (운영자 확인)
// 5. CANCELLED | CANCELLED (사용자 주문 취소)
// 6. CANCELLED | EXPIRED (입금 기한 만료 취소)
// 7. CANCELLED | ?? (운영 취소)
