import { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import type {
  InfiniteData,
  QueryFunction,
  QueryKey,
} from '@tanstack/react-query';
import {
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

type UseSuspensePaginationProps<TPage extends { hasNext: boolean }> = {
  queryKey: QueryKey;
  queryFn: QueryFunction<TPage, QueryKey, number>;
  staleTime?: number;
};

export default function useSuspensePagination<
  TPage extends { hasNext: boolean },
>({ queryKey, queryFn, staleTime = 0 }: UseSuspensePaginationProps<TPage>) {
  const queryClient = useQueryClient();

  const { data, isFetching, refetch, fetchNextPage } = useSuspenseInfiniteQuery(
    {
      queryKey,
      queryFn,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (!lastPage?.hasNext) {
          return undefined;
        }
        return lastPageParam + 1;
      },
      staleTime,
    }
  );

  // refetch할 경우 페이지를 초기화하고 첫 페이지만 다시 요청
  const refetchWithReset = useCallback(async () => {
    queryClient.setQueryData<InfiniteData<TPage>>(queryKey, (oldData) => ({
      pages: oldData?.pages.slice(0, 1) || [],
      pageParams: oldData?.pageParams.slice(0, 1) || [],
    }));
    await refetch();
  }, [queryClient, queryKey, refetch]);

  const { ref, inView } = useInView({
    threshold: 0.8,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return {
    data,
    isFetching,
    refetch: refetchWithReset,
    ref,
  };
}
