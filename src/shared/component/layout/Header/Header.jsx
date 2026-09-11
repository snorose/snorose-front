import { Link } from 'react-router-dom';

import { IconMultiLogo } from '@snorose/icons';

import { MenuIcon } from '@/shared/component';
import { useAuth } from '@/shared/hook';

import { useLogout } from '@/feature/auth/hooks';

import styles from './Header.module.css';

export default function Header({ className }) {
  const { status } = useAuth();
  const { mutate: logout } = useLogout();

  return (
    <>
      <header className={`${styles.header} ${className}`}>
        <Link to='/home'>
          <IconMultiLogo width={151} height={27} />
        </Link>
        <div className={styles.action}>
          {status === 'authenticated' ? (
            <button className={styles.button} onClick={logout}>
              로그아웃
            </button>
          ) : (
            <Link className={styles.button} to='/login'>
              로그인
            </Link>
          )}
          <MenuIcon />
        </div>
      </header>
    </>
  );
}
