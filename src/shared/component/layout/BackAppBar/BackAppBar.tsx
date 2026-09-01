import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Icon, MenuIcon } from '@/shared/component';

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
        <Icon
          className={styles.back}
          id='arrow-left'
          width={19}
          height={17}
          fill={isDark && 'white'}
          onClick={() => (backNavTo ? navigate(backNavTo) : navigate(-1))}
        />
        {title && <span className={styles.title}>{title}</span>}
      </div>
      <div className={hasSearchInput ? styles.hasWideWidth : styles.actions}>
        {hasSearch && (
          <Link to={`${pathname}/search`}>
            <Icon id='search-thick' width={20} height={20} stroke='#00368E' />
          </Link>
        )}
        {hasMenu && <MenuIcon />}
        {children}
      </div>
    </div>
  );
}
