import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchReport } from '@/feature/support/api';

import { BackAppBar, Chip, FetchLoading } from '@/shared/component';
import { QUERY_KEY } from '@/shared/constant';

import { REPORT_STATUS_MAP } from '@/feature/support/constant';
import { useDeletePostHandler } from '@/feature/board/hook/useDeletePostHandler';
import { PostDetailView } from '@/feature/board/ui';
import { PostActionBar } from '@/feature/board/component';
import { CommentInputContainer } from '@/feature/comment/component';

import { NotFoundPage } from '@/page/etc';

export default function ReportDetailPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<SuspenseFallback />}>
        <ReportDetailLoader />
      </Suspense>
    </ErrorBoundary>
  );
}

function ReportDetailLoader() {
  const { postId } = useParams();

  const { data } = useSuspenseQuery({
    queryKey: QUERY_KEY.post(postId),
    queryFn: () => fetchReport(postId),
    staleTime: 1000 * 60 * 5,
  });

  const { handleDelete } = useDeletePostHandler();

  return (
    <PostDetailView
      data={data}
      deletePost={handleDelete}
      PostActionBar={
        <PostActionBar>
          <PostActionBar.Comment {...data} />
        </PostActionBar>
      }
      CommentInputContainer={CommentInputContainer}
      Chip={
        <Chip name={REPORT_STATUS_MAP[data.status].label} variant='gradient' />
      }
    />
  );
}

function ErrorFallback({ error, resetErrorBoundary }) {
  if (error?.response.status === 404) {
    return <NotFoundPage />;
  }
}

function SuspenseFallback() {
  return (
    <>
      <BackAppBar notFixed />
      <FetchLoading>게시글 불러오는 중...</FetchLoading>
    </>
  );
}
