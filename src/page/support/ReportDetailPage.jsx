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
import { REPORT_STATUS_MAP } from '@/feature/support/constant';
import useReportDetail from '@/feature/support/hook/useReportDetail';
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
  const reportId = Number(postIdParam);

  const { data } = useReportDetail(reportId);
  const { mutate: withdrawReport } = useWithdrawReport();

  const { setModal } = useContext(ModalContext);
  const [clickedImageIndex, setClickedImageIndex] = useState(0);

  const onMenuOpen = () => {
    setModal({
      id: 'my-report-more-options',
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
            <Chip name='신고' variant='grey' />
            <Chip
              name={REPORT_STATUS_MAP[data.status].label}
              variant={REPORT_STATUS_MAP[data.status].variant}
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
        handleWithdrawReport={() => withdrawReport(reportId)}
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
