import { useState } from 'react';

export default function useOrderConfirmModal() {
  const [isOrderConfirmModalOpen, setIsOrderConfirmModalOpen] = useState(false);

  const openOrderConfirmModal = () => setIsOrderConfirmModalOpen(true);
  const closeOrderConfirmModal = () => setIsOrderConfirmModalOpen(false);

  return {
    isOrderConfirmModalOpen,
    openOrderConfirmModal,
    closeOrderConfirmModal,
  };
}
