import { Suspense, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';

import { IconEllipsis } from '@snorose/icons';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import {
  BackAppBar,
  Chip,
  FetchLoading,
  NoticeModal,
  ServerErrorFallback,
} from '@/shared/component';
import { NOTICE_MODAL_TEXT, QUERY_KEYS, TOAST } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';
import { useToast } from '@/shared/hook';

import { PostActionBar } from '@/feature/board/component';
import { PostDetailView } from '@/feature/board/ui';
import { CommentInputContainer } from '@/feature/comment/component';
import { deleteInquiry, readInquiry } from '@/feature/support/api';
import { INQUIRY_STATUS_MAP } from '@/feature/support/constant';

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
  const { postId: postIdParam } = useParams();
  const inquiryId = Number(postIdParam);

  const queryClient = useQueryClient();

  const { setModal } = useContext(ModalContext);
  const { toast } = useToast();

  const { data } = useSuspenseQuery({
    queryKey: QUERY_KEYS.inquiry.byId(inquiryId),
    queryFn: () => readInquiry(inquiryId),
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: deleteInquiryMutate } = useMutation({
    mutationFn: () => deleteInquiry(inquiryId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.inquiry.byId(inquiryId),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myActivity.list('inquiryReport'),
      });

      toast.success(TOAST.INQUIRY.delete);

      navigate(-1);
    },
    onError: (error) => {
      toast.error(error.message);
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
