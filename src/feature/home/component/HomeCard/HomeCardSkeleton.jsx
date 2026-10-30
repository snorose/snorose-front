import { ShimmerEffect } from '@/shared/component';

import styles from './HomeCardSkeleton.module.css';

export default function HomeCardSkeleton() {
  return (
    <ShimmerEffect>
      <div className={styles.layout}>
        <div className={styles.notice}></div>
        <div className={styles.attendance}></div>
      </div>
    </ShimmerEffect>
  );
}
