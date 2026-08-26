import { useCallback, useEffect, useRef } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { createOrder, getSale } from '@/feature/commerce/apis';
import type { SaleResponse } from '@/feature/commerce/types';

export function useSale(saleId: string) {
  return useQuery<SaleResponse>({
    queryKey: QUERY_KEY.commerceSale(saleId),
    queryFn: () => getSale(saleId),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.commerceOrders });
    },
  });
}

export function useOrderClientRequestId(resetKey: string) {
  const clientRequestIdRef = useRef<string | null>(null);

  const getClientRequestId = useCallback(() => {
    if (!clientRequestIdRef.current) {
      clientRequestIdRef.current = crypto.randomUUID();
    }

    return clientRequestIdRef.current;
  }, []);

  const resetClientRequestId = useCallback(() => {
    clientRequestIdRef.current = null;
  }, []);

  useEffect(() => {
    resetClientRequestId();
  }, [resetClientRequestId, resetKey]);

  return { getClientRequestId, resetClientRequestId };
}
