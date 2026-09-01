import { useState } from 'react';

import { useAuth } from '@/shared/hook';

export default function useOrdererInfo() {
  const { userInfo } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const handlePhoneNumber = (value: string) => {
    setPhoneNumber(value);
  };

  return {
    name: userInfo.userName ?? '-',
    studentNumber: userInfo.studentNumber ?? '-',
    phoneNumber,
    handlePhoneNumber,
  };
}
