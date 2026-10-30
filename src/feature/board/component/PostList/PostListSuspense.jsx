import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { FetchLoading } from '@/shared/component';

import { PostList, PostListErrorFallback } from '@/feature/board/component';

/**
 * TODO(board): 라우트 개선 작업 완료 후 교체
 */
export default function PostListSuspense() {
  const { pathname, search } = useLocation();

  // 게시판이나 필터(쿼리)가 바뀌면 에러 상태를 초기화하고 다시 요청한다
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          resetKeys={[pathname, search]}
          FallbackComponent={PostListErrorFallback}
        >
          <Suspense
            fallback={<FetchLoading>게시글 불러오는 중...</FetchLoading>}
          >
            <PostList />
            {/* <NewPostList /> */}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
