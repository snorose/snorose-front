import { Suspense, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';

import { useSuspenseQuery } from '@tanstack/react-query';

import {
  BackAppBar,
  Chip,
  ConfirmModal,
  FetchLoading,
  NoticeModal,
  ServerErrorFallback,
} from '@/shared/component';
import { NOTICE_MODAL_TEXT, QUERY_KEY } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';

import { MeatBallIcon, PostActionBar } from '@/feature/board/component';
import { useDeletePostHandler } from '@/feature/board/hook/useDeletePostHandler';
import { PostDetailView } from '@/feature/board/ui';
import { CommentInputContainer } from '@/feature/comment/component';
import { readReport } from '@/feature/support/api';
import { REPORT_STATUS_MAP } from '@/feature/support/constant';

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
  const { setModal } = useContext(ModalContext);

  const { data } = useSuspenseQuery({
    queryKey: QUERY_KEY.post(postId),
    queryFn: () => readReport(postId),
    staleTime: 1000 * 60 * 5,
  });

  const { handleDelete } = useDeletePostHandler();

  const onMenuOpen = () => {
    const id = data.isWriter ? 'my-post-more-options' : 'post-more-options';

    setModal({
      id,
      type: null,
    });
  };

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
      Actions={
        data.status === 'PENDING' && <MeatBallIcon onClick={onMenuOpen} />
      }
    />
  );
}

function ErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  const status = error.response?.status;

  if (status === 404) {
    throw error;
  }

  switch (error.response.status) {
    case 403:
      return (
        <NoticeModal
          modalText={NOTICE_MODAL_TEXT.NOT_POST_AUTHOR}
          onConfirm={() => navigate(-1)}
        />
      );
    default:
      return <ServerErrorFallback reset={resetErrorBoundary} />;
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
