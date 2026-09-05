import React from 'react';

import { IconChevronDown } from '@snorose/icons';

import { Icon } from '@/shared/component';

import styles from './AccordianBoards.module.css';

export default function DropDownBoards({ title, isOpen, onClick, children }) {
  return (
    <>
      <div
        className={`${styles.dropdown} ${!isOpen ? styles.closedDropdown : ''}`}
      >
        <span className={styles.title}>{title}</span>
        <IconChevronDown
          width={24}
          height={24}
          viewBox='0 0 24 24'
          className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
          onClick={onClick}
        />
      </div>
      {isOpen && <div>{children}</div>}
    </>
  );
}
