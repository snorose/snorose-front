import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { BackAppBar } from '@/shared/component';
import { DateTime, formatNumber } from '@/shared/lib';

import { PostListErrorFallback } from '@/feature/board/component';
import {
  FULFILLMENT_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
} from '@/feature/commerce/constants';
import useOrder from '@/feature/commerce/hooks/useOrder';

import styles from './OrderDetailPage.module.css';

export default function OrderDetailPage() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={PostListErrorFallback}
        >
          <Suspense>
            <OrderDetailView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function OrderDetailView() {
  const { orderNumber } = useParams();

  const { data: order } = useOrder(orderNumber);
  const { orderStatus, paymentStatus, fulfillmentStatus } = order;

  const showBankInfo =
    (orderStatus === 'ACTIVE' && paymentStatus === 'WAITING') ||
    (orderStatus === 'ACTIVE' && paymentStatus === 'REVIEW_REQUIRED');

  const pickUpInfo =
    (orderStatus === 'ACTIVE' &&
      paymentStatus === 'PAID' &&
      fulfillmentStatus === 'PENDING') ||
    orderStatus === 'COMPLETED';

  return (
    <div>
      <BackAppBar title='주문 상세' notFixed />

      {showBankInfo && (
        <section className={`${styles.info} ${styles.paymentInfo}`}>
          <h2 className={styles.infoTitle}>입금 안내</h2>
          <dl className={styles.infoList}>
            <div className={styles.infoItem}>
              <dt>계좌</dt>
              <dd>
                {order.bank.bankName} {order.bank.accountNumber}
              </dd>
            </div>
            <div className={styles.infoItem}>
              <dt>예금주</dt>
              <dd>{order.bank.accountHolder}</dd>
            </div>
            <div className={styles.infoItem}>
              <dt>금액</dt>
              <dd>{formatNumber(order.totalAmount)}원</dd>
            </div>
            <div className={styles.infoItem}>
              <dt>입금 기한</dt>
              <dd>{DateTime.format(order.paymentDueAt, 'YMD_HM')}</dd>
            </div>
          </dl>
        </section>
      )}
      <section className={`${styles.info} ${styles.orderInfo}`}>
        <h2 className={styles.infoTitle}>주문 정보</h2>
        <dl className={styles.infoList}>
          <div className={styles.infoItem}>
            <dt>주문번호</dt>
            <dd>{order.orderNumber}</dd>
          </div>
          <div className={styles.infoItem}>
            <dt>상품</dt>
            <div className={styles.productItemList}>
              {order.items.map((item) => (
                <dd>
                  {item.name} · {item.optionLabel}
                </dd>
              ))}
            </div>
          </div>
          <div className={styles.infoItem}>
            <dt>결제</dt>
            <dd>{PAYMENT_STATUS_LABEL[order.paymentStatus]}</dd>
          </div>
          <div className={styles.infoItem}>
            <dt>수령</dt>
            <dd>{FULFILLMENT_STATUS_LABEL[order.fulfillmentStatus]}</dd>
          </div>
        </dl>
      </section>
      {pickUpInfo && (
        <section className={`${styles.info} ${styles.pickUpInfo}`}>
          <h2 className={styles.infoTitle}>수령 안내</h2>
          <dl className={styles.infoList}>
            <div className={styles.infoItem}>
              <dt>장소</dt>
              <dd>{order.pickup.pickupPlace}</dd>
            </div>
            <div className={styles.infoItem}>
              <dt>안내</dt>
              <dd>{order.pickup.pickupInstructions}</dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  );
}
