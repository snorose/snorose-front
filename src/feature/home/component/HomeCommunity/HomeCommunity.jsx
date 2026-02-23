import { useAuth } from '@/shared/hook';
import { BOARD_REGISTRY } from '@/shared/lib';
import { USER_STATUS, NEW_ROUTES } from '@/shared/constant';

import { HomeBoardCard } from '@/feature/home/component';
import { ACCESS_MESSAGES } from '@/feature/home/constant';

import { BOARD_IMAGES } from '@/assets/map/board-assets';

import styles from './HomeCommunity.module.css';

const COMMUNITIES = BOARD_REGISTRY.communities;
const EVENT = BOARD_REGISTRY.find('event');
const MAIN_BOARDS = [...COMMUNITIES, EVENT];

export default function HomeCommunity() {
  const { status } = useAuth();
  const isLogin = status === USER_STATUS.isLogin;

  return (
    <div className={styles.commuintyContainer}>
      <div className={`${styles.list}`}>
        {MAIN_BOARDS.map(({ key, name }) => (
          <HomeBoardCard
            key={`home-community-${key}`}
            name={name}
            path={NEW_ROUTES.post.list(key)}
            mainImage={BOARD_IMAGES[key].main}
          />
        ))}
      </div>
      {isLogin ? (
        ''
      ) : (
        <p className={styles.notLogin}>{ACCESS_MESSAGES.NEED_LOGIN}</p>
      )}
    </div>
  );
}
