import { Icon } from '@/shared/component';

import styles from './MeatBallIcon.module.css';

export default function MeatBallIcon({ onClick }) {
  return (
    <div className={styles.meatBall} onClick={onClick}>
      <Icon id='meat-ball' width={18} height={4} stroke='none' />
    </div>
  );
}
