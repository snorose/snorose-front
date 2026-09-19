import { IconCheck } from '@snorose/icons';

import styles from './DropdownList.module.css';
export default function DropdownList({
  options,
  select,
  onSelect,
  className = '',
}) {
  return (
    <ul className={`${styles.dropdownContent} ${className}`}>
      {options.map((option) => (
        <li
          key={option.id}
          className={`${styles.option} ${
            select?.id === option.id ? styles.selected : ''
          }`}
          onClick={() => onSelect(option)}
        >
          {option.name}
          {select?.id === option.id && (
            <IconCheck
              className={styles.checkIconBlue} 
            />
          )}
        </li>
      ))}
    </ul>
  );
}
