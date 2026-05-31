import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation, useParams } from 'react-router-dom';

import { useSuspenseQuery } from '@tanstack/react-query';

import { BackAppBar, FetchLoading } from '@/shared/component';
import { QUERY_KEY, ROLE } from '@/shared/constant';
import { BOARD_REGISTRY, getBoard } from '@/shared/lib';

import { BellIcon } from '@/feature/alert/component';
import { PostActionBar } from '@/feature/board/component';
import { useDeletePostHandler } from '@/feature/board/hook/useDeletePostHandler';
import { PostDetailView } from '@/feature/board/ui';
import { CommentInputContainer } from '@/feature/comment/component';

import { NotFoundPage } from '@/page/etc';

import { getPostContent } from '@/apis';

const NOTICE_BOARD_ID = BOARD_REGISTRY.find('notice').id;
const EVENT_BOARD_ID = BOARD_REGISTRY.find('event').id;
const ADMIN_BADGE_BOARD_IDS = [NOTICE_BOARD_ID, EVENT_BOARD_ID];

export default function PostDetailPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<SuspenseFallback />}>
        <PostDetailLoader />
      </Suspense>
    </ErrorBoundary>
  );
}

/** TODO(board): 라우트 개선 작업 완료 후 교체 */
function PostDetailLoader() {
  const { postId } = useParams();
  const { pathname } = useLocation();

  const currentBoard = getBoard(pathname.split('/')[2]);
  // const { id: boardId } = useBoard();

  const { data } = useSuspenseQuery({
    queryKey: QUERY_KEY.post(postId),
    queryFn: () => getPostContent(currentBoard?.id, postId),
    staleTime: 1000 * 60 * 5,
    // enabled: !!currentBoard?.id && !!postId,
  });

  const { handleDelete } = useDeletePostHandler(
    currentBoard.id,
    currentBoard.textId
  );

  return (
    <PostDetailView
      data={data}
      authorBadgeRoleId={
        ADMIN_BADGE_BOARD_IDS.includes(currentBoard.id) ? ROLE.admin : undefined
      }
      deletePost={handleDelete}
      PostActionBar={
        <PostActionBar>
          <PostActionBar.Comment {...data} />
          <PostActionBar.Like postId={postId} {...data} />
          <PostActionBar.Scrap {...data} />
        </PostActionBar>
      }
      CommentInputContainer={CommentInputContainer}
      BellIcon={
        <BellIcon
          boardId={currentBoard.id}
          postId={postId}
          isActive={data.isCommentAlertConsent}
        />
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
