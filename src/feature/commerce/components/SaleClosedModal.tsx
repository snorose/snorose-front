import { DimModalLayout } from '@/shared/component';

import styles from '@/page/commerce/SaleDetailPage.module.css';

export default function SaleClosedModal({ onClose }: { onClose: () => void }) {
  return (
    <DimModalLayout>
      <div
        className={styles.accountModal}
        role='dialog'
        aria-modal='true'
        aria-labelledby='saleClosedModalTitle'
      >
        <div className={styles.accountModalContent}>
          <h3 id='saleClosedModalTitle' className={styles.accountModalTitle}>
            판매가 마감되었어요
          </h3>
          <p className={styles.saleClosedModalDescription}>
            이 상품은 새 주문을 받을 수 없어요. 기존 주문과 수령 안내는 판매자의
            공지를 확인해주세요.
          </p>
        </div>

        <button
          type='button'
          className={styles.accountModalButton}
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </DimModalLayout>
  );
}
