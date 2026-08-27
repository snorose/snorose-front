import styles from './PrimaryButton.module.css';

export default function PrimaryButton({
  className = '',
  onClick,
  children,
  ...rest
}) {
  return (
    <button
      className={`${styles.button} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
