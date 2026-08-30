import { useEffect, useRef, useState } from 'react';

import { Icon } from '@/shared/component';

import styles from './DropdownCategory.module.css';

export default function DropdownCategory({
  options,
  value,
  onChange,
  placeholder = '카테고리를 선택해주세요',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <p className={styles.label}>카테고리</p>

      <button
        type='button'
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={value ? styles.value : styles.placeholder}>
          {value || placeholder}
        </span>

        <Icon
          id='angle-down'
          width={24}
          height={24}
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {options.map((option) => {
            const selected = value === option;

            return (
              <button
                key={option}
                type='button'
                className={`${styles.item} ${
                  selected ? styles.selected : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                <span>{option}</span>

                {selected && <Icon id='check' width={18} height={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}