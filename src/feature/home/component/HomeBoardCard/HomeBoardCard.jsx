import { Link } from 'react-router-dom';

import { USER_STATUS } from '@/shared/constant';
import { useAuth } from '@/shared/hook';

import lockImage from '@/assets/images/lock.svg';

import styles from './HomeBoardCard.module.css';

export default function HomeBoardCard({ path, name, mainImage }) {
  const { status } = useAuth();
  const isLogin = status === USER_STATUS.isLogin;
  const MainImage = mainImage;

  const backgroundClass = {
    첫눈온방: styles.firstSnow,
    함박눈방: styles.largeSnow,
    만년설방: styles.permanentSnow,
    이벤트: styles.event,
  };

  return (
    <Link className={`${styles.link}`} to={path}>
      <div className={styles.cardSection}>
        <div className={`${styles.card} ${backgroundClass[name]}`}>
          {!isLogin ? (
            <img src={lockImage} alt={name} />
          ) : typeof mainImage === 'string' ? (
            <img
              src={mainImage}
              alt={name}
              className={styles.icon}
            />
          ) : (
            <MainImage
              aria-label={name}
              className={`${styles.icon} ${styles.svgIcon}`}
            />
          )}
        </div>
        {isLogin ? <p className={styles.name}>{name}</p> : ''}
      </div>
    </Link>
  );
}
