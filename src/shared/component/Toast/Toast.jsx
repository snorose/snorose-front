import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import {
  IconMultiCheckGreenCircle,
  IconMultiExclamationTriangle,
  IconMultiInfoCircle,
} from '@snorose/icons';

import { useToastContext } from '@/shared/context/ToastContext';

import styles from './Toast.module.css';

export default function Toast({ toast }) {
  const { removeToast } = useToastContext();
  const toastRef = useRef(null);

  const toastConfig = {
    error: {
      iconComponent: IconMultiExclamationTriangle,
      className: styles.error,
    },
    info: {
      iconComponent: IconMultiInfoCircle,
      className: styles.info,
    },
    success: {
      iconComponent: IconMultiCheckGreenCircle,
      className: styles.success,
    },
  };

  const variant = toast.variant || 'info';
  const config = toastConfig[variant] || toastConfig.info;
  const ToastIcon = config.iconComponent;
  const toastClassName = `${styles.toast} ${config.className || ''}`;

  useEffect(() => {
    const fadeOut = setTimeout(() => {
      if (toastRef.current) {
        toastRef.current.style.opacity = '0';
      }
    }, 300000);

    const unmount = setTimeout(() => {
      removeToast(toast.message);
    }, 3500);

    return () => {
      clearTimeout(fadeOut);
      clearTimeout(unmount);
    };
  }, [toast]);

  const root = document.getElementById('toast');
  if (!root) return null;

  return createPortal(
    <div ref={toastRef} className={toastClassName}>
      <ToastIcon className={styles.icon} width={21} height={20} />
      <p className={styles.message}>{toast.message}</p>
    </div>,
    root
  );
}
