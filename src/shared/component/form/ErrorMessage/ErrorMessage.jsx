import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ children }) {
  return <div className={styles.message}>{children}</div>;
}
