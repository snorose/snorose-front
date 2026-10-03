import { createContext, useContext, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { Toast } from '@/shared/component';

import { isMaintenanceBlocked } from '@/feature/maintenance/access';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ message, variant = 'default' }) => {
    if (isMaintenanceBlocked()) return;
    if (toasts.find((item) => item.message === message)) {
      removeToast(message);
    }
    setToasts((prev) => [...prev, { id: uuidv4(), message, variant }]);
  };

  const removeToast = (message) => {
    setToasts((prev) => prev.filter((item) => item.message !== message));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {toasts.length > 0 &&
        toasts.map((toast) => <Toast key={toast.id} toast={toast} />)}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastContext);
}
