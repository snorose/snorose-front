import { Link, useLocation, useNavigate } from 'react-router-dom';

import { IconArrowLeft, IconSearch } from '@snorose/icons';

import { MenuIcon } from '@/shared/component';

import styles from './BackAppBar.module.css';

export default function BackAppBar({
  title,
  hasMenu = false,
  hasSearch = false,
  children,
  hasSearchInput = false,
  isDark = false,
  notFixed = false,
  backNavTo,
  backgroundColor,
}: {
  title: string;
  hasMenu?: boolean;
  hasSearch?: boolean;
  children?: React.ReactNode;
  hasSearchInput?: boolean;
  isDark?: boolean;
  notFixed?: boolean;
  backNavTo?: string;
  backgroundColor?: string;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`${styles.appBar} ${hasSearchInput && styles.hasGap}`}
      style={{
        backgroundColor: backgroundColor ? backgroundColor : '#fff',
        position: notFixed ? 'relative' : 'fixed',
      }}
    >
      <div className={styles.backDiv}>
        <IconArrowLeft
          className={styles.back}
          width={19}
          height={17}
          color={isDark && 'white'}
          onClick={() => (backNavTo ? navigate(backNavTo) : navigate(-1))}
        />
        {title && <span className={styles.title}>{title}</span>}
      </div>
      <div className={hasSearchInput ? styles.hasWideWidth : styles.actions}>
        {hasSearch && (
          <Link to={`${pathname}/search`}>
            <IconSearch width={20} height={20} color='var(--blue-4)' />
          </Link>
        )}
        {hasMenu && <MenuIcon />}
        {children}
      </div>
    </div>
  );
}
