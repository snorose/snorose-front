import { Link, useSearchParams } from 'react-router-dom';

import { FetchLoading, List, PullToRefresh } from '@/shared/component';
import { QUERY_KEY, STALE_TIME } from '@/shared/constant';
import { useSuspensePagination } from '@/shared/hook';
import { deduplicatePaginatedData, flatPaginationCache } from '@/shared/lib';

import { PostBar } from '@/feature/board/component';

import { getExamReviewList } from '@/apis';

import styles from './SearchExamReviewList.module.css';

export default function SearchExamReviewList() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, ref, isFetching, refetch } = useSuspensePagination({
    queryKey: [QUERY_KEY.reviews, JSON.stringify(params)],
    queryFn: ({ pageParam }) =>
      getExamReviewList({
        page: pageParam,
        params,
      }),
    staleTime: STALE_TIME.searchList,
  });

  const examList = deduplicatePaginatedData(flatPaginationCache(data));

  if (examList.length === 0 && !isFetching) {
    const error = new Error('검색 결과가 없습니다.');
    error.status = 404;
    throw error;
  }

  return (
    <PullToRefresh onRefresh={refetch}>
      <List className={styles.examReviewList}>
        {examList.map((post, index) => (
          <Link
            className={styles.to}
            ref={index === examList.length - 1 ? ref : undefined}
            key={post.postId}
            to={`/board/exam-review/post/${post.postId}`}
          >
            <PostBar {...post} content={post.questionDetail}>
              {post.isConfirmed && <PostBar.ConfirmedChip />}
            </PostBar>
          </Link>
        ))}
        {isFetching && <FetchLoading />}
      </List>
    </PullToRefresh>
  );
}
