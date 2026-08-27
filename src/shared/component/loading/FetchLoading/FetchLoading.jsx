import cloudLogo from '@/assets/images/cloudLogo.svg';

import styles from './FetchLoading.module.css';

export default function FetchLoading({
  className = '',
  children = null,
  animation = true,
}) {
  return (
    <div className={`${styles.loading} ${className}`}>
      <div className={styles.centerBox}>
        <div className={animation ? styles.icon : styles.iconStatic}>
          <img src={cloudLogo} alt='로고' />
        </div>
        <p>{children}</p>
      </div>
    </div>
  );
}
