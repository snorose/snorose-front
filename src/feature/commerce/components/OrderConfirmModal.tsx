import { useEffect, useRef, useState } from 'react';

import { DimModalLayout } from '@/shared/component';
import { formatNumber } from '@/shared/lib';

import type { Sale, SelectedOrderItem } from '@/feature/commerce/types';

import styles from '@/page/commerce/SaleDetailPage.module.css';

type OrderConfirmModalProps = {
  sale: Sale;
  selectedOrderItems: SelectedOrderItem[];
  totalPaymentAmount: number;
  phoneNumber: string;
  isConfirming: boolean;
  onEdit: () => void;
  onConfirm: () => void;
};

export default function OrderConfirmModal({
  sale,
  selectedOrderItems,
  totalPaymentAmount,
  phoneNumber,
  isConfirming,
  onEdit,
  onConfirm,
}: OrderConfirmModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasMoreContent, setHasMoreContent] = useState(false);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) return;

    const updateScrollHint = () => {
      const hasOverflow = content.scrollHeight > content.clientHeight;
      const isScrolledToBottom =
        content.scrollTop + content.clientHeight >= content.scrollHeight - 1;

      setHasMoreContent(hasOverflow && !isScrolledToBottom);
    };

    updateScrollHint();
    window.addEventListener('resize', updateScrollHint);

    return () => window.removeEventListener('resize', updateScrollHint);
  }, [selectedOrderItems, totalPaymentAmount, phoneNumber]);

  return (
    <DimModalLayout>
      <div
        className={`${styles.accountModal} ${
          hasMoreContent ? styles.accountModalScrollHint : ''
        }`}
        role='dialog'
        aria-modal='true'
        aria-labelledby='orderConfirmModalTitle'
      >
        <div
          ref={contentRef}
          className={styles.accountModalContent}
          onScroll={() => {
            const content = contentRef.current;

            if (!content) return;

            setHasMoreContent(
              content.scrollTop + content.clientHeight <
                content.scrollHeight - 1
            );
          }}
        >
          <h3 id='orderConfirmModalTitle' className={styles.accountModalTitle}>
            주문 전 확인
          </h3>

          <section className={styles.orderConfirmSection}>
            <h4 className={styles.orderConfirmSectionTitle}>주문 상품</h4>
            <ul className={styles.orderConfirmProductList}>
              {selectedOrderItems.map(({ product, variant, quantity }) => (
                <li
                  className={styles.orderConfirmProductItem}
                  key={`${product.productId}-${variant.variantId}`}
                >
                  <div className={styles.orderConfirmProductInfo}>
                    <strong>{product.name}</strong>
                    <span className={styles.orderConfirmProductDivider}>·</span>
                    <span>{variant.optionName}</span>
                  </div>
                  <div className={styles.orderConfirmProductSummary}>
                    <span>{quantity}개</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.orderConfirmSection}>
            <h4 className={styles.orderConfirmSectionTitle}>주문 정보</h4>
            <dl className={styles.accountInfoList}>
              <div className={styles.accountInfoItem}>
                <dt>총액</dt>
                <dd>{formatNumber(totalPaymentAmount)}원</dd>
              </div>
              <div className={styles.accountInfoItem}>
                <dt>연락처</dt>
                <dd>{phoneNumber}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.orderConfirmSection}>
            <h4 className={styles.orderConfirmSectionTitle}>입금 안내</h4>
            <dl className={styles.accountInfoList}>
              <div className={styles.accountInfoItem}>
                <dt>계좌번호</dt>
                <dd>{sale.bank.accountNumber}</dd>
              </div>
              <div className={styles.accountInfoItem}>
                <dt>은행</dt>
                <dd>{sale.bank.bankName}</dd>
              </div>
              <div className={styles.accountInfoItem}>
                <dt>예금주</dt>
                <dd>{sale.bank.accountHolder}</dd>
              </div>
            </dl>
          </section>

          <ul className={styles.orderConfirmNoticeList}>
            <li>주문 후 안내되는 학생단체 계좌로 직접 입금합니다.</li>
            <li>입금 확인 전까지만 구매자가 취소할 수 있습니다.</li>
            <li>배송 없이 지정 장소에서 수령합니다.</li>
          </ul>
        </div>

        <div className={styles.accountModalButtonGroup}>
          <button
            type='button'
            className={`${styles.accountModalButton} ${styles.accountModalSecondaryButton}`}
            onClick={onEdit}
          >
            수정하기
          </button>
          <button
            type='button'
            className={styles.accountModalButton}
            disabled={isConfirming}
            onClick={onConfirm}
          >
            {isConfirming ? '주문 중...' : '주문 확정하기'}
          </button>
        </div>
      </div>
    </DimModalLayout>
  );
}
