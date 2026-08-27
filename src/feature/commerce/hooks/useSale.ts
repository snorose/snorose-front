import { useSuspenseQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { getSale } from '@/feature/commerce/apis';
import { SaleResponse } from '@/feature/commerce/types';

export default function useSale(saleId: string) {
  return useSuspenseQuery<SaleResponse>({
    queryKey: QUERY_KEY.commerceSale(saleId),
    queryFn: () => getSale(saleId!),
  });
}
