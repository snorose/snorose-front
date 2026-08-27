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
          <Chip
            name={ORDER_STATUS_LABEL[orderStatus]}
            variant={'grey'}
            size='sm'
          />
          <Chip
            name={PAYMENT_STATUS_LABEL[paymentStatus]}
            variant={paymentStatus === 'PAID' ? 'gradient' : 'grey'}
            size='sm'
          />
          <Chip
            name={FULFILLMENT_STATUS_LABEL[fulfillmentStatus]}
            variant={fulfillmentStatus === 'PICKED_UP' ? 'gradient' : 'grey'}
            size='sm'
          />
        </div>
      </div>
    </div>
  );
}
