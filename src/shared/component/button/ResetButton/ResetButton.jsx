import { IconRefresh } from '@snorose/icons';

import styles from './ResetButton.module.css';

export default function ResetButton({ reset }) {
  return (
    <IconRefresh
      className={styles.retry}
      color='var(--grey-4)'
      onClick={reset}
    />
  );
}
