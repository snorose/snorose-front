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
        title: '외부 링크로 연결할까요?',
        description:
          '다른 사용자가 공유한 외부 링크의 <br />안전 여부는 스노로즈에서 내용을 <br />확인하기 어려우니 주의해주세요',
        cancelText: '취소',
        confirmText: '연결',
      }}
      onCancel={onClose}
      onConfirm={onConfirm}
      confirmButtonClassName={styles.linkConfirmButton}
    >
      <div
        className={styles.checkRow}
        onClick={() => setChecked(!checked)}
      >
        <div
          className={`${styles.checkCircle} ${
            checked ? styles.checked : ''
          }`}
        >
          <Icon
            id='check-editor'
            className={styles.checkIcon}
          />
        </div>

        <span className={styles.checkText}>
          이 게시판에서 다시 보지 않기
        </span>
      </div>
    </ConfirmModal>
  );
}