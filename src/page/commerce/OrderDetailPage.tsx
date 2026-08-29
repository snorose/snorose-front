import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import {
  BackAppBar,
  FetchLoading,
  PrimaryButton,
  ServerErrorFallback,
} from '@/shared/component';
import { useToast } from '@/shared/hook';
import { DateTime, formatNumber } from '@/shared/lib';

import CancelOrderConfirmModal from '@/feature/commerce/components/CancelOrderConfirmModal';
import {
  FULFILLMENT_STATUS_LABEL,
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
} from '@/feature/commerce/constants';
import useCancelConfirmModal from '@/feature/commerce/hooks/useCancelConfirmModal';
import useOrder from '@/feature/commerce/hooks/useOrder';
import useOrderCancel from '@/feature/commerce/hooks/useOrderCancel';
import { getCommerceErrorCode } from '@/feature/commerce/utils/saleDetail';

import styles from './OrderDetailPage.module.css';

export default function OrderDetailPage() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
          <Suspense
            fallback={<FetchLoading>주문 상세 불러오는 중...</FetchLoading>}
          >
            <OrderDetailView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function OrderDetailView() {
  const { orderNumber } = useParams();

  const { data: order, refetch } = useOrder(orderNumber);
  const { mutate: cancelOrder, isPending } = useOrderCancel();

  const { toast } = useToast();
  const {
    isCancelConfirmModalOpen,
    openCancelConfirmModal,
    closeCancelConfirmModal,
  } = useCancelConfirmModal();

  const { orderStatus, paymentStatus, fulfillmentStatus } = order;

  const showBankInfo =
    (orderStatus === 'ACTIVE' && paymentStatus === 'WAITING') ||
    (orderStatus === 'ACTIVE' && paymentStatus === 'REVIEW_REQUIRED');

  const pickUpInfo =
    (orderStatus === 'ACTIVE' &&
      paymentStatus === 'PAID' &&
      fulfillmentStatus === 'PENDING') ||
    orderStatus === 'COMPLETED';

  const handleCancelOrder = () => {
    if (!order.cancellable || isPending) {
      return;
    }

    cancelOrder(orderNumber, {
      onSuccess: () => {
        toast({ message: '주문이 취소되었어요', variant: 'success' });
        refetch();
      },
      onError: (error) => {
        const errorCode = getCommerceErrorCode(error);

        switch (errorCode) {
          case 7014: // 타인 주문
            toast({ message: '유효한 요청이 아닙니다', variant: 'error' });
            break;
          case 7017: // PAID / REVIEW_REQUIRED / PICKED_UP
            toast({
              message: '입금 전에만 취소할 수 있어요',
              variant: 'error',
            });
            break;
          case 7015: // 이미 취소·완료됨 (재요청)
            toast({
              message: '이미 취소된 주문입니다',
              variant: 'error',
            });
        }
      },
    });
  };

  return (
    <div>
      <BackAppBar title='주문 상세' backNavTo={'/commerce/orders'} notFixed />

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
                  <div className={styles.productItem}>
                    <span>
                      {item.name} · {item.optionLabel}
                    </span>
                    <span>{item.quantity}개</span>
                  </div>
                </dd>
              ))}
            </div>
          </div>
          <div className={styles.infoItem}>
            <dt>금액</dt>
            <dd>{formatNumber(order.totalAmount)}원</dd>
          </div>
          <div className={styles.infoItem}>
            <dt>결제</dt>
            <dd>
              {orderStatus === 'CANCELED'
                ? ORDER_STATUS_LABEL[orderStatus]
                : PAYMENT_STATUS_LABEL[order.paymentStatus]}
            </dd>
          </div>
          <div className={styles.infoItem}>
            <dt>수령</dt>
            <dd>
              {orderStatus === 'CANCELED'
                ? ORDER_STATUS_LABEL[orderStatus]
                : FULFILLMENT_STATUS_LABEL[fulfillmentStatus]}
            </dd>
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

      {orderStatus === 'ACTIVE' && paymentStatus === 'REVIEW_REQUIRED' && (
        <div className={styles.feedback}>{order.reviewNotice}</div>
      )}

      {order.cancellable && (
        <div className={styles.butttonWrapper}>
          <PrimaryButton
            className={styles.button}
            disabled={isPending}
            onClick={() => {
              openCancelConfirmModal();
            }}
          >
            {isPending ? '취소 중...' : '주문 취소'}
          </PrimaryButton>
        </div>
      )}

      {isCancelConfirmModalOpen && (
        <CancelOrderConfirmModal
          onClose={closeCancelConfirmModal}
          onConfirm={() => {
            closeCancelConfirmModal();
            handleCancelOrder();
          }}
        />
      )}
    </div>
  );
}

function ErrorFallback({ error, resetErrorBoundary }) {
  const errorCode = getCommerceErrorCode(error);

  switch (errorCode) {
    case 7013:
    case 7014:
      return (
        <div className={styles.container}>
          <BackAppBar title='내 주문' notFixed />
          <section className={styles.feedback} aria-live='polite'>
            존재하지 않는 주문이에요
          </section>
        </div>
      );
    default:
      return <ServerErrorFallback reset={resetErrorBoundary} />;
  }
}
