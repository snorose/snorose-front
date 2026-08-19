import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { getSale } from '@/feature/commerce/apis';
import { Sale } from '@/feature/commerce/types';

export function useSale(saleId: string) {
  return useQuery<Sale>({
    queryKey: QUERY_KEY.commerceSale(saleId),
    queryFn: () => getSale(saleId),
  });
}
