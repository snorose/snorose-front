import { useState } from 'react';

export default function useSaleClosedModal() {
  const [isSaleClosedModalOpen, setIsSaleClosedModalOpen] = useState(false);

  const openSaleClosedModal = () => setIsSaleClosedModalOpen(true);
  const closeSaleClosedModal = () => setIsSaleClosedModalOpen(false);

  return {
    isSaleClosedModalOpen,
    openSaleClosedModal,
    closeSaleClosedModal,
  };
}
