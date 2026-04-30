import { Suspense, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';

import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import {
  BackAppBar,
  Chip,
  FetchLoading,
  NoticeModal,
  ServerErrorFallback,
} from '@/shared/component';
import { QUERY_KEY } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';
import { useToast } from '@/shared/hook';

import { MeatBallIcon, PostActionBar } from '@/feature/board/component';
import { PostDetailView } from '@/feature/board/ui';
import { CommentInputContainer } from '@/feature/comment/component';
import { deleteInquiry, readInquiry } from '@/feature/support/api';
import { INQUIRY_STATUS_MAP } from '@/feature/support/constant';

import { NotFoundPage } from '@/page/etc';

export default function InquiryDetailPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<SuspenseFallback />}>
        <InquiryDetailLoader />
      </Suspense>
    </ErrorBoundary>
  );
}

function InquiryDetailLoader() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { setModal } = useContext(ModalContext);

  const { toast } = useToast();

  const { data } = useSuspenseQuery({
    queryKey: QUERY_KEY.post(postId),
    queryFn: () => readInquiry(postId),
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: deleteInquiryMutate } = useMutation({
    mutationFn: () => deleteInquiry(postId),
    onSuccess: () => {
      navigate(-1);
    },
    onError: (error) => {
      toast({ message: error.message, variant: 'error' });
    },
  });

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
      deletePost={deleteInquiryMutate}
      PostActionBar={
        <PostActionBar>
          <PostActionBar.Comment {...data} />
        </PostActionBar>
      }
      CommentInputContainer={CommentInputContainer}
      Chip={
        <Chip name={INQUIRY_STATUS_MAP[data.status].label} variant='gradient' />
      }
      Actions={
        data.status === 'PENDING' && <MeatBallIcon onClick={onMenuOpen} />
      }
    />
  );
}

function ErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  if (error.response?.status >= 500) {
    return <ServerErrorFallback reset={resetErrorBoundary} />;
  }

  switch (error.response?.status) {
    case 403:
      return (
        <NoticeModal
          modalText={{
            title: '권한 없음',
            description: '내가 작성한 글이 아니에요',
            confirmText: '돌아가기',
          }}
          onConfirm={() => navigate('/', { replace: true })}
        />
      );
    case 404:
      return <NotFoundPage />;
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
