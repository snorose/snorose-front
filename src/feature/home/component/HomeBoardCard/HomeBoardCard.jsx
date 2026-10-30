import { Link } from 'react-router-dom';

import { IllustrationPadlock } from '@snorose/icons';

import { USER_STATUS } from '@/shared/constant';
import { useAuth } from '@/shared/hook';

import styles from './HomeBoardCard.module.css';

export default function HomeBoardCard({ path, name, mainImage }) {
  const { status } = useAuth();
  const isLogin = status === USER_STATUS.isLogin;
  const MainImage = isLogin ? mainImage : IllustrationPadlock;

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
          <MainImage
            className={isLogin ? styles.icon : styles.lockIcon}
            role='img'
            aria-label={isLogin ? name : '잠금'}
          />
        </div>
        {isLogin ? <p className={styles.name}>{name}</p> : ''}
      </div>
    </Link>
  );
}
