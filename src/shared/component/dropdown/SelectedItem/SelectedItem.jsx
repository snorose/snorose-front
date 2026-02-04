import { Icon } from '@/shared/component';

import styles from './SelectedItem.module.css';

export default function SelectedItem({ select, placeholder, isOpen, onClick }) {
  return (
    <div
      className={`
        ${styles.selectedItem}
        ${isOpen ? styles.open : ''}
        ${!isOpen && select?.name ? styles.colored : ''}
      `}
    >
      <div
        className={`${styles.select} ${select ? '' : styles.unselect}`}
        onClick={onClick}
      >
        {select?.name || (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <Icon
          id='arrow-down'
          width={16}
          height={9}
          className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
        />
      </div>
    </div>
  );
}
