import { QUERY_KEY } from '@/shared/constant';
import { useSuspenseInfiniteScroll } from '@/shared/hook';

import { readOrders } from '@/feature/commerce/apis';
import { OrdersResponse } from '@/feature/commerce/types';

export default function useOrders() {
  return useSuspenseInfiniteScroll<OrdersResponse['data'][number]>({
    queryKey: QUERY_KEY.commerceOrders,
    queryFn: ({ pageParam }) => readOrders(pageParam),
    getItemKey: (item) => item.orderNumber,
  });
}
