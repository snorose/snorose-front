import { Link } from 'react-router-dom';

import { IllustrationPadlock } from '@snorose/icons';

import { USER_STATUS } from '@/shared/constant';
import { useAuth } from '@/shared/hook';

import styles from './HomeBoardCard.module.css';

const MAIN_IMAGE_VIEW_BOX = {
  첫눈온방: '0 0 43 53',
  함박눈방: '0 0 64 64',
  만년설방: '0 0 64 64',
  이벤트: '0 0 47 62',
};
const LOCK_IMAGE_VIEW_BOX = '0 0 30 33';

export default function HomeBoardCard({ path, name, mainImage }) {
  const { status } = useAuth();
  const isLogin = status === USER_STATUS.isLogin;
  const MainImage = isLogin ? mainImage : IllustrationPadlock;
  const imageViewBox = isLogin ? MAIN_IMAGE_VIEW_BOX[name] : LOCK_IMAGE_VIEW_BOX;

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
            viewBox={imageViewBox}
          />
        </div>
        {isLogin ? <p className={styles.name}>{name}</p> : ''}
      </div>
    </Link>
  );
}
