import { ConfirmModal, Icon } from '@/shared/component';

import styles from './LinkAlertModal.module.css';

export default function LinkAlertModal({
  isOpen,
  onClose,
  onConfirm,
  checked,
  setChecked,
}) {
  if (!isOpen) return null;

  return (
    <ConfirmModal
      modalText={{
        title: '외부 링크로 이동할까요?',
        description:
          '다른 사용자가 게시한 외부 링크는<br /> 안전하지 않을 수 있어요',
        cancelText: '취소',
        confirmText: '연결',
      }}
      onCancel={onClose}
      onConfirm={onConfirm}
      confirmButtonClassName={styles.linkConfirmButton}
    >
      <div className={styles.checkRow} onClick={() => setChecked(!checked)}>
        <div
          className={`${styles.checkCircle} ${checked ? styles.checked : ''}`}
        >
          <Icon id='check-editor' className={styles.checkIcon} />
        </div>

        <span className={styles.checkText}>다시 보지 않기</span>
      </div>
    </ConfirmModal>
  );
}
