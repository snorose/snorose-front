import { Link, useLocation } from 'react-router-dom';

import { IconBell, IconBellFill } from '@snorose/icons';
import { useQuery } from '@tanstack/react-query';

import { fetchUnreadAlertCount } from '@/apis/alert';

import { Icon } from '@/shared/component';
import { NAVBAR_MENUS, QUERY_KEY } from '@/shared/constant';
import { useAuth } from '@/shared/hook';

import styles from './Navbar.module.css';

export default function Navbar() {
  const { pathname } = useLocation();
  const { status } = useAuth();

  const isActive = ({ id, to }) =>
    pathname === to ||
    (id === 'home' && pathname === '/') ||
    (id === 'test' && pathname.startsWith('/board/exam-review/search'));

  const { data: unreadAlertCount = 0 } = useQuery({
    queryKey: QUERY_KEY.unreadNotificationCount,

    queryFn: fetchUnreadAlertCount,

    staleTime: 5 * 60 * 1000,

    gcTime: 30 * 60 * 1000,

    enabled: status === 'authenticated',
  });

  return (
    <nav className={styles.nav}>
      <ul className={styles.menus}>
        {NAVBAR_MENUS &&
          NAVBAR_MENUS.map(({ id, to, label, ...props }) => (
            <Link key={id} to={to}>
              <li className={styles.menu}>
                <div className={styles.iconWrapper}>
                  {id === 'bell' ? (
                    isActive({ id, to }) ? (
                      <IconBellFill {...props} />
                    ) : (
                      <IconBell {...props} />
                    )
                  ) : (
                    <Icon
                      id={isActive({ id, to }) ? `${id}-fill` : id}
                      {...props}
                    />
                  )}
                  {id === 'bell' && unreadAlertCount > 0 && (
                    <div className={styles.badge}>
                      <span>
                        {unreadAlertCount > 99 ? '99+' : unreadAlertCount}
                      </span>
                    </div>
                  )}
                </div>
                <span
                  style={{
                    color: isActive({ id, to }) ? '#00368E' : '#5F86BF',
                  }}
                >
                  {label}
                </span>
              </li>
            </Link>
          ))}
      </ul>
    </nav>
  );
}
