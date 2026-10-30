import { useContext } from 'react';

import { DimModalLayout } from '@/shared/component';
import { ModalContext } from '@/shared/context/ModalContext';

import styles from './NoticeModal.module.css';

export default function NoticeModal({ modalText, onConfirm }) {
  const { modal, setModal } = useContext(ModalContext);

  const handleConfirm = () => {
    onConfirm?.() || setModal({ id: null, type: null });
  };

  return (
    <DimModalLayout isOpen={modal?.id}>
      <div className={styles.container}>
        <div className={styles.content}>
          {modalText.title && (
            <h3 className={styles.title}>{modalText.title}</h3>
          )}
          {modalText.description && (
            <p className={styles.description}>{modalText.description}</p>
          )}
        </div>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          {modalText.confirmText}
        </button>
      </div>
    </DimModalLayout>
  );
}
