import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import {
  IconMultiCheckGreenCircle,
  IconMultiExclamationTriangle,
  IconMultiInfoCircle,
} from '@snorose/icons';

import { useToast } from '@/shared/hook';

import styles from './Toast.module.css';

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

export default function Toast({ toast }) {
  const { removeToast } = useToast();
  const toastRef = useRef(null);

  const config = toastConfig[toast.variant];
  const { iconComponent: ToastIcon, className } = config;
  const toastOptions = toast.options;

  useEffect(() => {
    const fadeOut = setTimeout(() => {
      if (toastRef.current) {
        toastRef.current.style.opacity = '0';
      }
    }, 300000);

    const unmount = setTimeout(() => {
      removeToast(toast.id);
    }, 3500);

    return () => {
      clearTimeout(fadeOut);
      clearTimeout(unmount);
    };
  }, [toast]);

  const root = document.getElementById('toast');
  if (!root) return null;

  return createPortal(
    <div ref={toastRef} className={`${styles.toast} ${className}`}>
      <ToastIcon className={styles.icon} width={21} height={20} />
      <p className={styles.message}>{toast.message}</p>
      {toastOptions && (
        <button className={styles.button} onClick={toastOptions.action}>
          {toastOptions.label}
        </button>
      )}
    </div>,
    root
  );
}
