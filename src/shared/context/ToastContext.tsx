import { createContext, useContext, useState } from 'react';

import { Toast } from '@/shared/component';

const ToastContext = createContext<{
  setToasts: React.Dispatch<React.SetStateAction<Array<ToastPropsType>>>;
} | null>(null);

export type ToastPropsType = {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'info';
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState<Array<ToastPropsType>>([]);

  return (
    <ToastContext.Provider value={{ setToasts }}>
      {children}
      {toasts.length > 0 &&
        toasts.map((toast) => <Toast key={toast.id} toast={toast} />)}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
