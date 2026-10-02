import styles from './FilterList.module.css';

export default function FilterList({ children }) {
  return <div className={styles.filters}>{children}</div>;
}
