import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import {
  IconMultiExclamationTriangle,
  IconMultiInfoCircle,
  IconMultiCheckGreenCircle
} from '@snorose/icons';


import { Icon } from '@/shared/component';
import { useToastContext } from '@/shared/context/ToastContext';

import styles from './Toast.module.css';

export default function Toast({ toast }) {
  const { removeToast } = useToastContext();
  const toastRef = useRef(null);

  const toastConfig = {
    error: {
      icon: 'info-triangle',
      className: styles.error,
    },
    info: {
      icon: 'info-circle',
      className: styles.info,
    },
    success: {
      iconComponent: IconMultiCheckGreenCircle,
      className: styles.success,
    },
  };

  const variant = toast.variant || 'info';
  const config = toastConfig[variant] || toastConfig.info;
  const iconId = config.icon;
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
      {iconId === 'info-triangle' && (
        <IconMultiExclamationTriangle
          className={styles.icon}
          width={21}
          height={20}
        />
      )}
      {iconId === 'info-circle' && (
        <IconMultiInfoCircle className={styles.icon} width={21} height={20} />
      )}
      {iconId !== 'info-triangle' && iconId !== 'info-circle' && (

        <Icon className={styles.icon} id={iconId} width={21} height={20} />
      )}
      <p className={styles.message}>{toast.message}</p>
    </div>,
    root
  );
}
