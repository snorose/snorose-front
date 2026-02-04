import styles from './InputLayout.module.css';

const inputStyle = {
  default: styles.default,
  valid: styles.valid,
  error: styles.error,
};

export default function InputLayout({ children, status }) {
  return (
    <div className={`${styles.container} ${inputStyle[status]}`}>
      {children}
    </div>
  );
}
