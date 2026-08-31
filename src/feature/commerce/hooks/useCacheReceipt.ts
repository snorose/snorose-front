import { useState } from 'react';

export default function useCacheReceipt() {
  const [isCacheReceiptHope, setIsCacheReceiptHope] = useState(false);
  const [cacheReceiptPhoneNumber, setCacheReceiptPhoneNumber] = useState('');

  const handleCacheReceiptHope = (checked: boolean) =>
    setIsCacheReceiptHope(checked);
  const handleCacheReceiptPhoneNumber = (value: string) =>
    setCacheReceiptPhoneNumber(value);

  const [isCacheReceiptAgree, setIsCacheReceiptAgree] = useState(false);
  const handleCacheReceiptAgree = (checked: boolean) =>
    setIsCacheReceiptAgree(checked);
  return {
    isCacheReceiptHope,
    handleCacheReceiptHope,
    cacheReceiptPhoneNumber,
    handleCacheReceiptPhoneNumber,
    isCacheReceiptAgree,
    handleCacheReceiptAgree,
  };
}
