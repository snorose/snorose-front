import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { FetchLoading } from '@/shared/component';

import {
  NewPostList,
  PostList,
  PostListErrorFallback,
} from '@/feature/board/component';

/**
 * TODO(board): 라우트 개선 작업 완료 후 교체
 */
export default function PostListSuspense() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
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
