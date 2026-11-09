import { Suspense, useContext, useState } from 'react';
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
import { useModalReset } from '@/shared/hook';

import {
  AttachmentSwiper,
  FullScreenAttachment,
} from '@/feature/attachment/component';
import { Content, PostModalRenderer } from '@/feature/board/component';
import { CommentActionButton } from '@/feature/board/component/PostActionBar/PostActionBar';
import PostLayout from '@/feature/board/PostLayout/PostLayout';
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
  const navigate = useNavigate();
  const { postId: postIdParam } = useParams();
  const inquiryId = Number(postIdParam);

  const { data } = useInquiryDetail(inquiryId);
  const { mutate: deleteInquiry } = useInquiryDelete();

  const { setModal } = useContext(ModalContext);
  const [clickedImageIndex, setClickedImageIndex] = useState(0);

  const onMenuOpen = () => {
    setModal({
      id: 'my-post-more-options',
      type: null,
    });
  };

  useModalReset();

  return (
    <div>
      {clickedImageIndex === 0 ? (
        <BackAppBar backgroundColor={'#fbfdff'} />
      ) : (
        <FullScreenAttachment
          attachmentUrls={data.attachments}
          clickedImageIndex={clickedImageIndex}
          setClickedImageIndex={setClickedImageIndex}
        />
      )}

      <PostLayout>
        <PostLayout.Header>
          <PostLayout.Meta {...data}>
            <Chip name='문의' variant='grey' />
            <Chip
              name={INQUIRY_STATUS_MAP[data.status].label}
              variant={INQUIRY_STATUS_MAP[data.status].variant}
            />
          </PostLayout.Meta>

          <PostLayout.ActionGroup>
            {data.status === 'PENDING' && (
              <IconEllipsis
                onClick={onMenuOpen}
                width={24}
                height={24}
                color='var(--grey-3-1)'
              />
            )}
          </PostLayout.ActionGroup>
        </PostLayout.Header>

        <PostLayout.Body>
          <PostLayout.Title title={data.title} />
          <Content content={data.content} />
          {data.attachments.length > 0 && (
            <AttachmentSwiper
              attachments={data.attachments}
              setClickedImageIndex={setClickedImageIndex}
            />
          )}
        </PostLayout.Body>

        <PostLayout.Footer>
          <CommentActionButton {...data} />
        </PostLayout.Footer>
      </PostLayout>

      <CommentInputContainer />

      <PostModalRenderer
        handleEdit={() => {
          setModal({ id: null, type: null });
          navigate(`./edit`);
        }}
        handleDelete={() => deleteInquiry(inquiryId)}
      />
    </div>
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
