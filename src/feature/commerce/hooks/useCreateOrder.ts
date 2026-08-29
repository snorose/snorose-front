import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { createOrder } from '@/feature/commerce/apis';

export default function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.commerceOrders });
    },
  });
}
