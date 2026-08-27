import { QUERY_KEY } from '@/shared/constant';
import { useSuspensePagination } from '@/shared/hook';

import { readOrders } from '@/feature/commerce/apis';

export default function useOrders() {
  return useSuspensePagination({
    queryKey: QUERY_KEY.commerceOrders,
    queryFn: ({ pageParam }) => readOrders(pageParam),
  });
}
