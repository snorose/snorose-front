import { Icon } from '@/shared/component';

import styles from './LinkAlertModal.module.css';

export default function LinkAlertModal({
  isOpen,
  onClose,
  onConfirm,
  checked,
  setChecked,
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (checked) {
      localStorage.setItem('hideLinkAlert', 'true');
    }

    onConfirm();
  };
  
  return (
    <div className={styles.dim} onClick={onClose}>
      <div
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.content}>
          <h2 className={styles.title}>
            이 링크에 연결할까요?
          </h2>

          <p className={styles.description}>
            신뢰할 수 있는 링크인지
            <br />
            한 번 더 확인해주세요
          </p>

          <div
            className={styles.checkRow}
            onClick={() => setChecked(!checked)}
          >
            <div
              className={`${styles.checkCircle} ${checked ? styles.checked: ''}`}
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
        </div>

        <div className={styles.bottom}>
          <button
            className={`${styles.button} ${styles.cancelBtn}`}
            onClick={onClose}
          >
            취소
          </button>

          <button
            className={`${styles.button} ${styles.confirmBtn}`}
            onClick={handleConfirm}
          >
            연결
          </button>
        </div>
      </div>
    </div>
  );
}