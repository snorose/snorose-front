import { Link } from 'react-router-dom';

import { IconChevronRight } from '@snorose/icons';

import { Icon } from '@/shared/component';

import styles from './ListHeader.module.css';

export default function ListHeader({ to, title }) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      <Link to={to} className={styles.more}>
        더보기
        <IconChevronRight width={20} height={20} viewBox="0 0 24 24" />
      </Link>
    </div>
  );
}
