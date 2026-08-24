import { Link, useSearchParams } from 'react-router-dom';

import {
  FetchLoading,
  InfiniteScrollSentinel,
  List,
  PullToRefresh,
} from '@/shared/component';
import { QUERY_KEY, STALE_TIME } from '@/shared/constant';
import {
  useSuspenseInfiniteScroll,
  useSuspensePagination,
} from '@/shared/hook';
import { deduplicatePaginatedData, flatPaginationCache } from '@/shared/lib';

import { PostBar } from '@/feature/board/component';

import { getExamReviewList } from '@/apis';

import styles from './SearchExamReviewList.module.css';

export default function SearchExamReviewList() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const {
    items: examList,
    ref,
    isFetchingNextPage,
    refetch,
  } = useSuspenseInfiniteScroll({
    queryKey: [QUERY_KEY.reviews, JSON.stringify(params)],
    queryFn: ({ pageParam }) =>
      getExamReviewList({
        page: pageParam,
        params,
      }),
    staleTime: STALE_TIME.searchList,
    getItemKey: (item) => item.postId,
  });

  if (examList.length === 0 && !isFetchingNextPage) {
    throw { status: 404 };
  }

  return (
    <PullToRefresh onRefresh={refetch}>
      <List className={styles.examReviewList}>
        {examList.map((post) => (
          <Link
            className={styles.to}
            key={post.postId}
            to={`/board/exam-review/post/${post.postId}`}
          >
            <PostBar {...post} content={post.questionDetail}>
              {post.isConfirmed && <PostBar.ConfirmedIcon />}
            </PostBar>
          </Link>
        ))}

        <InfiniteScrollSentinel ref={ref} />
        {isFetchingNextPage && <FetchLoading />}
      </List>
    </PullToRefresh>
  );
}
