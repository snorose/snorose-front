import React from 'react';

import { Icon } from '@/shared/component';

import styles from './AccordianBoards.module.css';

export default function DropDownBoards({ title, isOpen, onClick, children }) {
  return (
    <>
      <div
        className={`${styles.dropdown} ${!isOpen ? styles.closedDropdown : ''}`}
      >
        <span className={styles.title}>{title}</span>
        <Icon
          id='arrow-down'
          width={24}
          height={24}
          className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
          fill='var(--grey-3-1)'
          onClick={onClick}
        />
      </div>
      {isOpen && <div>{children}</div>}
    </>
  );
}
