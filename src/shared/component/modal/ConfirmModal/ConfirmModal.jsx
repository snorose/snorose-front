import { useContext } from 'react';

import { DimModalLayout } from '@/shared/component';
import { ModalContext } from '@/shared/context/ModalContext';

import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ modalText, onConfirm, onCancel, children = null, confirmButtonClassName = '' }) {
  const { modal, setModal } = useContext(ModalContext);

  const handleCancel = () => {
    onCancel?.() || setModal({ id: null, type: null });
  };

  return (
    <DimModalLayout isOpen={modal?.id}>
      <div className={styles.top}>
        <h3
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: modalText.title }}
        />
        {modalText.description && (
          <p
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: modalText.description }}
          />
        )}
      </div>

      {children &&
        <div className={styles.extraContent}>
          {children}
        </div>
      }

      <div className={styles.contentDivider} />

      <div className={styles.bottom}>

        <button
          className={`${styles.bottomButton} ${styles.leftHover}`}
          onClick={handleCancel}
        >
          {modalText.cancelText}
        </button>
        <div className={styles.buttonDivider} />
        <button
          className={`${styles.bottomButton} ${styles.rightHover} ${confirmButtonClassName}`}
          onClick={onConfirm}
        >
          {modalText.confirmText}
        </button>
      </div>
    </DimModalLayout>
  );
}
