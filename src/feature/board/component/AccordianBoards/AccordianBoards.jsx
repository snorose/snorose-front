import React from 'react';

import { IconChevronDown } from '@snorose/icons';

import styles from './AccordianBoards.module.css';

export default function DropDownBoards({ title, isOpen, onClick, children }) {
  return (
    <>
      <button
        type='button'
        className={`${styles.dropdown} ${!isOpen ? styles.closedDropdown : ''}`}
        aria-expanded={isOpen}
        onClick={onClick}
      >
        <span className={styles.title}>{title}</span>
        <IconChevronDown
          width={24}
          height={24}
          className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
          aria-hidden='true'
        />
      </button>
      {isOpen && <div className={styles.content}>{children}</div>}
    </>
  );
}
