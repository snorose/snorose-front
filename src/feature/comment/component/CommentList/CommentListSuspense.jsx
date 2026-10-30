import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { FetchLoading } from '@/shared/component';

import {
  CommentList,
  CommentListErrorFallback,
} from '@/feature/comment/component';

export default function CommentListSuspense() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={CommentListErrorFallback}
        >
          <Suspense
            fallback={<FetchLoading>댓글을 불러오는 중...</FetchLoading>}
          >
            <CommentList />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
