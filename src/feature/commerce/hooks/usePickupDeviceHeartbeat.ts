import { useMutation } from '@tanstack/react-query';

import { sendPickupDeviceHeartbeat } from '@/feature/commerce/apis';

export default function usePickupDeviceHeartbeat() {
  return useMutation({
    mutationFn: sendPickupDeviceHeartbeat,
  });
}
