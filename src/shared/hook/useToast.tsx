import {
  type ToastOptions,
  useToastContext,
} from '@/shared/context/ToastContext';

import { isMaintenanceBlocked } from '@/feature/maintenance/access';

export default function useToast() {
  const { setToasts } = useToastContext();

  const addToast = (
    message: string,
    variant: 'success' | 'error' | 'info',
    options?: ToastOptions
  ) => {
    if (isMaintenanceBlocked()) return;

    const nextToast = { id: crypto.randomUUID(), message, variant, options };

    setToasts((prev) => [
      ...prev.filter((item) => item.message !== message),
      nextToast,
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const toast = {
    success: (message: string, options?: ToastOptions) =>
      addToast(message, 'success', options),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  };

  return { toast, removeToast };
}
