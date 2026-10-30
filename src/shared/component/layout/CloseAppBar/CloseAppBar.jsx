import { useNavigate } from 'react-router-dom';

import { IconX } from '@snorose/icons';

import styles from './CloseAppBar.module.css';

export default function CloseAppBar({
  alignRight = false,
  children,
  stroke = 'black',
  onClose = undefined,
  notFixed = false,
  backgroundColor,
}) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.appBar}
      style={{
        justifyContent: `${alignRight ? 'flex-end' : 'space-between'}`,
        backgroundColor: backgroundColor ? backgroundColor : '#fff',
        position: notFixed ? 'relative' : 'fixed',
      }}
    >
      <IconX
        className={styles.close}
        width={22}
        height={22}
        color={stroke}
        onClick={onClose ? onClose : () => navigate(-1)}
      />

      {children}
    </div>
  );
}
