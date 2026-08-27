import { useState } from 'react';

export default function useCancelConfirmModal() {
  const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] =
    useState(false);

  const openCancelConfirmModal = () => setIsCancelConfirmModalOpen(true);
  const closeCancelConfirmModal = () => setIsCancelConfirmModalOpen(false);

  return {
    isCancelConfirmModalOpen,
    openCancelConfirmModal,
    closeCancelConfirmModal,
  };
}
