import { DimModalLayout } from '@/shared/component';
import styles from '@/shared/component/modal/ConfirmModal/ConfirmModal.module.css';

export default function CancelOrderConfirmModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <DimModalLayout>
      <div className={styles.top}>
        <h3 className={styles.title}>주문 취소</h3>
        <div className={styles.description}>정말로 주문을 취소하시겠어요?</div>
      </div>

      <div className={styles.contentDivider} />

      <div className={styles.bottom}>
        <button
          className={`${styles.bottomButton} ${styles.leftHover}`}
          onClick={onClose}
        >
          닫기
        </button>

        <div className={styles.buttonDivider} />

        <button
          className={`${styles.bottomButton} ${styles.rightHover}`}
          onClick={onConfirm}
        >
          취소하기
        </button>
      </div>
    </DimModalLayout>
  );
}
