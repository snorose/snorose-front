import styles from './DateField.module.css';

export default function DateField({
  label,
  name,
  value,
  onChange,
  error,
  type = 'datetime-local',
  showDivider = false,
  ...props
}) {
  return (
    <div>
      <div className={styles.dateSection}>
        <p>
          {label === '당첨자 발표일' ? (
            <>
              당첨자 <br /> 발표일
            </>
          ) : (
            label
          )}
        </p>

        <div>
          <input
            type={type}
            aria-label={label}
            className={`${styles.dateInput} ${error ? styles.error : ''}`}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            {...props}
          />
        </div>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
