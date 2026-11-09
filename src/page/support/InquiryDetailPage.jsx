import { Suspense, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';

import { IconEllipsis } from '@snorose/icons';

import {
  BackAppBar,
  Chip,
  FetchLoading,
  NoticeModal,
  ServerErrorFallback,
} from '@/shared/component';
import { NOTICE_MODAL_TEXT } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';

import { PostActionBar } from '@/feature/board/component';
import { PostDetailView } from '@/feature/board/ui';
import { CommentInputContainer } from '@/feature/comment/component';
import { INQUIRY_STATUS_MAP } from '@/feature/support/constant';
import useInquiryDelete from '@/feature/support/hook/useInquiryDelete';
import useInquiryDetail from '@/feature/support/hook/useInquiryDetail';

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
  const { postId: postIdParam } = useParams();
  const inquiryId = Number(postIdParam);

  const { data } = useInquiryDetail(inquiryId);
  const { mutate: deleteInquiry } = useInquiryDelete();

  const { setModal } = useContext(ModalContext);

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
      deletePost={() => deleteInquiry(inquiryId)}
      PostActionBar={
        <PostActionBar>
          <PostActionBar.Comment {...data} />
        </PostActionBar>
      }
      CommentInputContainer={CommentInputContainer}
      Chip={
        <>
          <Chip name='문의' variant='grey' />
          <Chip
            name={INQUIRY_STATUS_MAP[data.status].label}
            variant={INQUIRY_STATUS_MAP[data.status].variant}
          />
        </>
      }
      Actions={
        data.status === 'PENDING' && (
          <IconEllipsis
            onClick={onMenuOpen}
            width={24}
            height={24}
            color='var(--grey-3-1)'
          />
        )
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
