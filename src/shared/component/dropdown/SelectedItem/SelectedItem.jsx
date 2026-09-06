import { IconChevronDown } from '@snorose/icons';

import styles from './SelectedItem.module.css';
export default function SelectedItem({
  select,
  placeholder,
  isOpen,
  onClick,
  status = 'default',
}) {
  return (
    <div
      className={`
        ${styles.selectedItem}
        ${isOpen ? styles.open : ''}
        ${!isOpen && select?.name ? styles.colored : ''}
      `}
    >
      <div
        className={`${styles.select} ${select ? '' : styles.unselect} ${styles[status] || ''}`}
        onClick={onClick}
      >
        {select?.name || (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <IconChevronDown
          className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
        />
      </div>
    </div>
  );
}
