import styles from './AppLayout.module.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.layout}>{children}</div>;
}
