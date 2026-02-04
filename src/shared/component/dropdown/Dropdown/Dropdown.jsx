import { useState } from 'react';

import { DropdownList, SelectedItem } from '@/shared/component';

import styles from './Dropdown.module.css';

export default function Dropdown({ options, placeholder, select, setFn }) {
  const [isOpen, setIsOpen] = useState(false);

  const updateSelect = (option) => {
    setFn((prev) => ({ ...prev, ...option }), option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <SelectedItem
        select={select}
        placeholder={placeholder}
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      <div
        className={`${styles.dropdownListWrapper} ${isOpen ? styles.open : ''}`}
        aria-hidden={!isOpen}
      >
        <DropdownList
          options={options}
          select={select}
          onSelect={updateSelect}
        />
      </div>
    </div>
  );
}
