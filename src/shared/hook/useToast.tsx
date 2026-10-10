import { v4 as uuidv4 } from 'uuid';

import { useToastContext } from '@/shared/context/ToastContext';

export default function useToast() {
  const { setToasts } = useToastContext();

  const addToast = (message: string, variant: 'success' | 'error' | 'info') => {
    const nextToast = { id: uuidv4(), message, variant };

    setToasts((prev) => {
      return [...prev.filter((item) => item.message !== message), nextToast];
    });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const toast = {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  };

  return { toast, removeToast };
}
