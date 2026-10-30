import { Link } from 'react-router-dom';

import { IconPencilFill } from '@snorose/icons';

import styles from './WriteButton.module.css';

export default function WriteButton({ to, className }) {
  return (
    <div className={styles.fixedWrapper}>
      <Link to={to}>
        <button className={`${styles.button} ${className}`}>
          <IconPencilFill width={30} height={30} color='var(--blue-2)' />
        </button>
      </Link>
    </div>
  );
}
