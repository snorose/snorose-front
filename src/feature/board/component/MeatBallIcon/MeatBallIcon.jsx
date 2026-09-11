import { IconEllipsis } from '@snorose/icons';

import styles from './MeatBallIcon.module.css';

export default function MeatBallIcon({ onClick }) {
  return (
    <div className={styles.meatBall} onClick={onClick}>
      <IconEllipsis width={18} height={4} color='var(--grey-3-1)' />
    </div>
  );
}
