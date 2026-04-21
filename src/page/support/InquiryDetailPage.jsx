import { Suspense, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';

import { useSuspenseQuery } from '@tanstack/react-query';

import { BackAppBar, Chip, FetchLoading } from '@/shared/component';
import { QUERY_KEY } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';

import { MeatBallIcon, PostActionBar } from '@/feature/board/component';
import { useDeletePostHandler } from '@/feature/board/hook/useDeletePostHandler';
import { PostDetailView } from '@/feature/board/ui';
import { CommentInputContainer } from '@/feature/comment/component';
import { fetchInquiry } from '@/feature/support/api';
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
  const { postId } = useParams();
  const { setModal } = useContext(ModalContext);

  const { data } = useSuspenseQuery({
    queryKey: QUERY_KEY.post(postId),
    queryFn: () => fetchInquiry(postId),
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
        <Chip name={INQUIRY_STATUS_MAP[data.status].label} variant='gradient' />
      }
      Actions={
        data.status === 'PENDING' && <MeatBallIcon onClick={onMenuOpen} />
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
