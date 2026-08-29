import DimModalLayout from '@/shared/component/modal/DimModalLayout/DimModalLayout';
import { formatNumber } from '@/shared/lib';

import type { SelectedOrderItem } from '@/feature/commerce/types';

import styles from '@/page/commerce/SaleDetailPage.module.css';

type OrderConfirmModalProps = {
  selectedOrderItems: SelectedOrderItem[];
  phoneNumber: string;
  totalPaymentAmount: number;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function OrderConfirmModal({
  selectedOrderItems,
  phoneNumber,
  totalPaymentAmount,
  isSubmitting,
  onCancel,
  onConfirm,
}: OrderConfirmModalProps) {
  return (
    <DimModalLayout>
      <div
        className={styles.accountModal}
        role='dialog'
        aria-modal='true'
        aria-labelledby='orderConfirmModalTitle'
      >
        <div className={styles.accountModalScrollHint}>
          <div className={styles.accountModalContent}>
            <h3
              id='orderConfirmModalTitle'
              className={styles.accountModalTitle}
            >
              주문 내용을 확인해주세요
            </h3>

            <section className={styles.orderConfirmSection}>
              <div className={styles.orderConfirmProductList}>
                {selectedOrderItems.map(
                  ({
                    productId,
                    productName,
                    variantId,
                    optionLabel,
                    quantity,
                  }) => (
                    <div
                      className={styles.orderConfirmProductItem}
                      key={`${productId}-${variantId}`}
                    >
                      <div className={styles.orderConfirmProductInfo}>
                        <strong>{productName}</strong>
                        <span className={styles.orderConfirmProductDivider}>
                          ·
                        </span>
                        <span>{optionLabel}</span>
                      </div>
                      <div className={styles.orderConfirmProductSummary}>
                        <span>{quantity}개</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            <section className={styles.orderConfirmSection}>
              <dl className={styles.accountInfoList}>
                <div className={styles.accountInfoItem}>
                  <dt>전화번호</dt>
                  <dd>{`${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`}</dd>
                </div>
                <div className={styles.accountInfoItem}>
                  <dt>총 결제 금액</dt>
                  <dd>{formatNumber(totalPaymentAmount)}원</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>

        <div className={styles.accountModalButtonGroup}>
          <button
            type='button'
            className={`${styles.accountModalButton} ${styles.accountModalSecondaryButton}`}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type='button'
            className={styles.accountModalButton}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? '주문 중' : '주문하기'}
          </button>
        </div>
      </div>
    </DimModalLayout>
  );
}
