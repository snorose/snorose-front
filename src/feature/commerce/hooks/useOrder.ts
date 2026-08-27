import { useSuspenseQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constant';

import { readOrder } from '@/feature/commerce/apis';

export default function useOrder(orderNumber: string) {
  return useSuspenseQuery({
    queryKey: QUERY_KEY.commerceOrder(orderNumber),
    queryFn: () => readOrder(orderNumber),
  });
}
