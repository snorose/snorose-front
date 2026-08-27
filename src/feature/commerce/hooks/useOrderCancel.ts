import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { cancelOrder } from '@/feature/commerce/apis';

export default function useOrderCancel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.commerceOrders });
    },
    onError: () => {},
  });
}
