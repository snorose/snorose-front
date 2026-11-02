import { Suspense, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';

import { useSuspenseQuery } from '@tanstack/react-query';

import {
  BackAppBar,
  Chip,
  FetchLoading,
  NoticeModal,
  ServerErrorFallback,
} from '@/shared/component';
import { NOTICE_MODAL_TEXT, QUERY_KEY } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';

import { MeatBallIcon, PostActionBar } from '@/feature/board/component';
import { PostDetailView } from '@/feature/board/ui';
import { CommentInputContainer } from '@/feature/comment/component';
import { readReport } from '@/feature/support/api';
import { REPORT_STATUS_MAP } from '@/feature/support/constant';
import useWithdrawReport from '@/feature/support/hook/useWithdrawReport';

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
  const { postId: postIdParam } = useParams();
  const postId = Number(postIdParam);

  const { setModal } = useContext(ModalContext);

  const { data } = useSuspenseQuery({
    queryKey: QUERY_KEY.post(postId),
    queryFn: () => readReport(postId),
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: withdrawReport } = useWithdrawReport();

  const onMenuOpen = () => {
    setModal({
      id: 'my-report-more-options',
      type: null,
    });
  };

  return (
    <PostDetailView
      data={data}
      handleWithdrawReport={() => withdrawReport(postId)}
      PostActionBar={
        <PostActionBar>
          <PostActionBar.Comment {...data} />
        </PostActionBar>
      }
      CommentInputContainer={CommentInputContainer}
      Chip={
        <Chip
          name={REPORT_STATUS_MAP[data.status].label}
          variant={REPORT_STATUS_MAP[data.status].variant}
        />
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

  switch (status) {
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
