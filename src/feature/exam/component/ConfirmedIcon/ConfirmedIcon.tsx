import { Icon } from '@/shared/component';

import styles from './ConfirmedIcon.module.css';

export default function ConfirmedIcon() {
  return (
    <div className={styles.container}>
      <Icon
        className={styles.confirmIcon}
        id='check-circle'
        width={12}
        height={12}
      />
      <span className={styles.tooltip}>리자 인증 완료</span>
    </div>
  );
}
