import {
  IconMultiCheckBlueCircle,
  IconMultiCheckGreyCircle,
} from '@snorose/icons';

import styles from './CheckBox.module.css';

export default function CheckBox({ id, checked, onChange }) {
  return (
    <div>
      <input
        id={id}
        className={styles.input}
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked, e)}
      />
      <label htmlFor={id}>
        {checked ? (
          <IconMultiCheckBlueCircle
            className={styles.icon}
            width={22}
            height={22}
          />
        ) : (
          <IconMultiCheckGreyCircle
            className={styles.icon}
            width={22}
            height={22}
          />
        )}
      </label>
    </div>
  );
}
