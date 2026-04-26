import { Link } from 'react-router-dom';

import { Icon } from '@/shared/component';

import styles from './WriteButton.module.css';

export default function WriteButton({ to, className }) {
  return (
    <div className={styles.fixedWrapper}>
      <Link to={to}>
        <button className={`${styles.button} ${className}`}>
          <Icon id='pencil' width={30} height={30} fill='#BFD7EC' />
        </button>
      </Link>
    </div>
  );
}

