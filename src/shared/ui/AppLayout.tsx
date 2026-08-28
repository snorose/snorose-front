import type { ReactNode } from 'react';

import styles from './AppLayout.module.css';

type AppLayoutProps = {
  children: ReactNode;
  variant?: 'default' | 'pickupDisplay';
};

export default function AppLayout({
  children,
  variant = 'default',
}: AppLayoutProps) {
  const className =
    variant === 'pickupDisplay'
      ? `${styles.layout} ${styles.pickupDisplayLayout}`
      : styles.layout;

  return <div className={className}>{children}</div>;
}
