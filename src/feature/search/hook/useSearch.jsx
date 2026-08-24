import { useSearchParams } from 'react-router-dom';

import { QUERY_KEY, STALE_TIME } from '@/shared/constant';
import { useSuspenseInfiniteScroll } from '@/shared/hook';

import { searchByBoard } from '@/apis';

export default function useSearch({ boardId, getItemKey }) {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  return useSuspenseInfiniteScroll({
    queryKey: [QUERY_KEY.search, boardId, JSON.stringify(params)],
    queryFn: ({ pageParam }) =>
      searchByBoard({
        boardId,
        page: pageParam,
        params,
      }),
    staleTime: STALE_TIME.searchList,
    getItemKey,
  });
}
