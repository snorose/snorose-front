import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { createOrder } from '@/feature/commerce/apis';

export default function useCreateOrder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.commerceOrders });

      const orderNumber = data.result.orderNumber;
      if (orderNumber) {
        navigate(`/commerce/orders/${orderNumber}`, { replace: true });
        return;
      }
    },
    onError: (error) => {},
  });
}
