import { Suspense, useContext, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { IconArrowUpRight, IconEllipsis } from '@snorose/icons';

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
import { getBoardTextId } from '@/shared/lib';

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

  const hasLink = data.targetBoardId && data.targetPostId;
  const boardName = hasLink ? getBoardTextId(data.targetBoardId) : '';
  const link = `/board/${boardName}/post/${data.targetPostId}`;

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

          {hasLink && (
            <Link to={link}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '1rem 1.4rem',
                  border: '1px solid var(--grey-3-1)',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    font: 'var(--text-body-2-reg)',
                    color: 'var(--grey-4)',
                  }}
                >
                  신고대상 확인하기
                </span>
                <IconArrowUpRight
                  width={16}
                  height={16}
                  color='var(--grey-4)'
                />
              </div>
            </Link>
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
