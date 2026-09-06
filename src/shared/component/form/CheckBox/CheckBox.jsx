import { Icon } from '@/shared/component';

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
        <Icon
          className={styles.icon}
          id={checked ? 'checkbox-blue' : 'checkbox-grey'}
          width={22}
          height={22}
        />
      </label>
    </div>
  );
}
