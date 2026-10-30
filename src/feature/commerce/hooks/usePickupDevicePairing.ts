import { useMutation } from '@tanstack/react-query';

import { pairPickupDevice } from '@/feature/commerce/apis';

export default function usePickupDevicePairing() {
  return useMutation({
    mutationFn: pairPickupDevice,
  });
}
