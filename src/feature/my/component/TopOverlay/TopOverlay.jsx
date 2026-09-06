import { Link } from 'react-router-dom';

import { IconPencilUnderline } from '@snorose/icons';

import styles from './TopOverlay.module.css';

export default function TopOverlay() {
  return (
    <div className={styles.myPageUpper}>
      <div className={styles.logoOverlay}>
        <Link to='edit-info'>
          <IconPencilUnderline
            className={styles.editIcon}
            width={24}
            height={24}
            color='white'
          />
        </Link>
      </div>
    </div>
  );
}
