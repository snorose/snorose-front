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

type InfiniteScrollPage<TItem> = {
  data: TItem[];
  hasNext: boolean;
};

type UseSuspenseInfiniteScrollOptions<
  TItem,
  TQueryKey extends QueryKey = QueryKey,
> = {
  queryKey: TQueryKey;
  queryFn: QueryFunction<InfiniteScrollPage<TItem>, TQueryKey, number>;
  staleTime?: number;
};

export default function useSuspenseInfiniteScroll<
  TItem,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryKey,
  queryFn,
  staleTime = 0,
}: UseSuspenseInfiniteScrollOptions<TItem, TQueryKey>) {
  const queryClient = useQueryClient();

  const infiniteQuery = useSuspenseInfiniteQuery<
    InfiniteScrollPage<TItem>,
    Error,
    InfiniteData<InfiniteScrollPage<TItem>, number>,
    TQueryKey,
    number
  >({
    queryKey,
    queryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasNext ? lastPageParam + 1 : undefined,
    staleTime,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    infiniteQuery;

  const items = data.pages.flatMap((page) => page.data);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px 0px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refetchWithReset = useCallback(async () => {
    await queryClient.cancelQueries({ queryKey });

    queryClient.setQueryData<InfiniteData<InfiniteScrollPage<TItem>, number>>(
      queryKey,
      (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return {
          pages: oldData.pages.slice(0, 1),
          pageParams: oldData.pageParams.slice(0, 1),
        };
      }
    );

    await refetch();
  }, [queryClient, queryKey, refetch]);

  return {
    ...infiniteQuery,
    items,
    refetch: refetchWithReset,
    ref,
  };
}
