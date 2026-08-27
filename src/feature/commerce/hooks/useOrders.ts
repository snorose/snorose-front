import { QUERY_KEY } from '@/shared/constant';
import useSuspensePagination from '@/shared/hook/useSuspensePagination';

import { readOrders } from '@/feature/commerce/apis';
import { OrdersResponse } from '@/feature/commerce/types';

export default function useOrders() {
  return useSuspensePagination<OrdersResponse>({
    queryKey: QUERY_KEY.commerceOrders,
    queryFn: ({ pageParam }) => readOrders(pageParam),
  });
}
