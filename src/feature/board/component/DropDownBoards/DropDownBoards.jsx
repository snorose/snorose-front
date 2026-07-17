import React from 'react';
import styles from './DropDownBoards.module.css';
import { Icon } from '@/shared/component';

export default function DropDownBoards({ title, isOpen, onClick, children }) {
  return (
    <>
      <div className={styles.dropdown}>
        <span className={styles.title}>{title}</span>
        <Icon
          id='arrow-down'
          width={16}
          height={9}
          className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
          fill='currentColor'
          onClick={onClick}
        />
      </div>
      {isOpen && <div>{children}</div>}
    </>
  );
}
