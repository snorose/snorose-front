import { DimModalLayout } from '@/shared/component';

import type { SaleType } from '@/feature/commerce/types';
import { fulfillmentWord } from '@/feature/commerce/utils/saleLabels';

import styles from '@/page/commerce/SaleDetailPage.module.css';

export default function SaleClosedModal({
  onClose,
  saleType,
}: {
  onClose: () => void;
  saleType?: SaleType;
}) {
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
            새 신청을 받을 수 없어요. 기존 신청과 {fulfillmentWord(saleType)}{' '}
            안내는 판매자의 공지를 확인해주세요.
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
