import { Chip } from '@/shared/component';
import { formatNumber } from '@/shared/lib';

import { OrdersResponse } from '@/feature/commerce/types';
import {
  isCanceled,
  isExpired,
  isPaymentPending,
  isPickedUp,
  isPickUpPending,
  isReview,
} from '@/feature/commerce/utils/commerceRules';

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
          {isPaymentPending(orderStatus, paymentStatus, fulfillmentStatus) && (
            <Chip name={'입금 대기'} variant={'gradient'} size='sm' />
          )}
          {isPickUpPending(orderStatus, paymentStatus, fulfillmentStatus) && (
            <Chip name={'수령 대기'} variant={'gradient'} size='sm' />
          )}
          {isPickedUp(orderStatus, paymentStatus, fulfillmentStatus) && (
            <Chip name={'수령 완료'} variant={'grey'} size='sm' />
          )}
          {isReview(paymentStatus) && (
            <Chip name={'검토 필요'} variant={'gradient'} size='sm' />
          )}
          {isCanceled(orderStatus, paymentStatus) && (
            <Chip name={'주문 취소'} variant={'grey'} size='sm' />
          )}
          {isExpired(orderStatus, paymentStatus) && (
            <Chip name={'입금 만료'} variant={'grey'} size='sm' />
          )}
        </div>
      </div>
    </div>
  );
}
