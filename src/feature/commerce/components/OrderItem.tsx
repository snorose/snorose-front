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
import { fulfillmentWord } from '@/feature/commerce/utils/saleLabels';

import styles from '@/page/commerce/OrderListPage.module.css';

import altImage from '@/assets/images/altImage.png';

export default function OrderItem({
  orderNumber,
  saleType,
  autoPaymentEnabled = true,
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
          {autoPaymentEnabled &&
            isPaymentPending(orderStatus, paymentStatus, fulfillmentStatus) && (
              <Chip name={'입금 대기'} variant={'gradient'} size='sm' />
            )}
          {isPickUpPending(
            orderStatus,
            paymentStatus,
            fulfillmentStatus,
            autoPaymentEnabled
          ) && (
            <Chip
              name={`${fulfillmentWord(saleType)} 대기`}
              variant={'gradient'}
              size='sm'
            />
          )}
          {isPickedUp(
            orderStatus,
            paymentStatus,
            fulfillmentStatus,
            autoPaymentEnabled
          ) && (
            <Chip
              name={`${fulfillmentWord(saleType)} 완료`}
              variant={'grey'}
              size='sm'
            />
          )}
          {orderStatus === 'COMPLETED' &&
            fulfillmentStatus === 'NOT_REQUIRED' && (
              <Chip name='신청 완료' variant='grey' size='sm' />
            )}
          {autoPaymentEnabled && isReview(paymentStatus) && (
            <Chip name={'검토 필요'} variant={'gradient'} size='sm' />
          )}
          {isCanceled(orderStatus, paymentStatus, autoPaymentEnabled) && (
            <Chip name={'주문 취소'} variant={'grey'} size='sm' />
          )}
          {autoPaymentEnabled && isExpired(orderStatus, paymentStatus) && (
            <Chip name={'입금 만료'} variant={'grey'} size='sm' />
          )}
        </div>
      </div>
    </div>
  );
}
