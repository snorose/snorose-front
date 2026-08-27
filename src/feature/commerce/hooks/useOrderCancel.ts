import { useMutation } from '@tanstack/react-query';

import { cancelOrder } from '@/feature/commerce/apis';

export default function useOrderCancel() {
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {},
    onError: () => {},
  });
}
