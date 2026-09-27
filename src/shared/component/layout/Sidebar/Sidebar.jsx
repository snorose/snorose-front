import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { IllustrationLogoSnoroseCloud } from '@snorose/icons';

import {
  FEATURE_FLAG,
  NOT_LOGIN_MENUS,
  SIDEBAR_MENUS,
} from '@/shared/constant';
import { useAuth } from '@/shared/hook';
import { useSidebarStore } from '@/shared/store';

import styles from './Sidebar.module.css';

export default function Sidebar() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const close = useSidebarStore((state) => state.close);
  const { status } = useAuth();
  const isCultureBoardOn = useFeatureIsOn(FEATURE_FLAG.cultureBoard);

  // 피처 플래그가 꺼진 메뉴는 노출하지 않음
  const isFeatureOn = (menu) =>
    menu.feature !== FEATURE_FLAG.cultureBoard || isCultureBoardOn;

  /**
   * TODO(board): 라우트 개선 작업 완료 후 교체 필요
   */
  const MENUS = (
    status === 'authenticated'
      ? SIDEBAR_MENUS
      : SIDEBAR_MENUS.filter((menu) => NOT_LOGIN_MENUS.includes(menu.title))
  ).filter(isFeatureOn);

  // const MENUS =
  //   status === 'authenticated'
  //     ? NEW_SIDEBAR_MENUS
  //     : NEW_SIDEBAR_MENUS.filter((menu) =>
  //         NOT_LOGIN_MENUS.includes(menu.title)
  //       );

  const handleEventPropagation = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', close);
    }

    return () => {
      document.removeEventListener('click', close);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.dim}>
      <aside onClick={handleEventPropagation} className={styles.sidebar}>
        <Link className={styles.logo} to='/'>
          <IllustrationLogoSnoroseCloud width={180} height={30} />
        </Link>

        <div className={styles.menuScroll}>
          {MENUS.map(({ to, title, items }) => (
            <div key={title} onClick={close}>
              <Link to={to}>
                <h3 className={styles.title}>{title}</h3>
              </Link>
              <MenuList items={items} />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function MenuList({ items }) {
  if (!items) return null;

  return (
    <ul className={styles.list}>
      {items.map(({ to, name }) => (
        <Link to={to} key={name} className={styles.item}>
          <li>{name}</li>
        </Link>
      ))}
    </ul>
  );
}
