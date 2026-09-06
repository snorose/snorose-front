import { useContext } from 'react';
import { createPortal } from 'react-dom';

import { IconMultiShare } from '@snorose/icons';

import { Icon } from '@/shared/component';
import { ModalContext } from '@/shared/context/ModalContext';

import { useCommentContext } from '@/feature/comment/context';

import styles from './MoreOptionModal.module.css';

export default function MoreOptionModal({ title, optionList, functions, top }) {
  const { setModal } = useContext(ModalContext);
  const { resetCommentState } = useCommentContext();

  const handleOptionClick = (item, idx) => {
    if (item.modalId) {
      setModal({ id: item.modalId, type: null });
    }

    if (functions?.[idx] && typeof functions[idx] === 'function') {
      functions[idx]();
    }
  };

  const handleOutsideClick = () => {
    setModal({ id: null, type: null });
    resetCommentState();
  };

  return createPortal(
    <div className={styles.background} onClick={handleOutsideClick}>
      <div
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
        style={{ top: top !== undefined ? `${top + 30}px` : '9rem' }}
      >
        <h3 className={styles.title}>{title}</h3>
        <ul className={styles.content}>
          {optionList.map((item, idx) => (
            <li
              key={idx}
              className={`${styles.contentItem} ${idx === optionList.length - 1 ? styles.lastItem : ''}`}
              onClick={() => handleOptionClick(item, idx)}
            >
              <p>{item.label}</p>
              {item.iconId === 'share' ? (
                <IconMultiShare
                  className={styles.itemIcon}
                  width={item.width}
                  height={item.height}
                />
              ) : (
                <Icon
                  id={item.iconId}
                  className={styles.itemIcon}
                  width={item.width}
                  height={item.height}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.getElementById('modal')
  );
}
