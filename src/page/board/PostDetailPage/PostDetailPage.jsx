import { Suspense, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation, useParams } from 'react-router-dom';

import { useSuspenseQuery } from '@tanstack/react-query';

import { BackAppBar, FetchLoading } from '@/shared/component';
import { BOARD_CATEGORY_MAP, QUERY_KEY, ROLE } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';
import { getBoard } from '@/shared/lib';

import { BellIcon } from '@/feature/alert/component';
import { MeatBallIcon, PostActionBar } from '@/feature/board/component';
import { useDeletePostHandler } from '@/feature/board/hook/useDeletePostHandler';
import { PostDetailView } from '@/feature/board/ui';
import { CommentInputContainer } from '@/feature/comment/component';

import { NotFoundPage } from '@/page/etc';

import { getPostContent } from '@/apis';

const NOTICE_BOARD_ID = getBoard('notice').id;
const EVENT_BOARD_ID = getBoard('event').id;
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
  const { setModal } = useContext(ModalContext);

  const currentBoard = getBoard(pathname.split('/')[2]);
  const categoryConfig = BOARD_CATEGORY_MAP[currentBoard.id];
  // const { id: boardId } = useBoard();

  const { data } = useSuspenseQuery({
    queryKey: QUERY_KEY.post(postId),
    queryFn: () => getPostContent(currentBoard?.id, postId),
    staleTime: 1000 * 60 * 5,
    // enabled: !!currentBoard?.id && !!postId,
  });

  const { handleDelete } = useDeletePostHandler(
    currentBoard?.id,
    currentBoard?.textId
  );

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
      categoryName={
        Array.isArray(categoryConfig)
          ? data.category
          : (categoryConfig?.[data.category] ?? data.category)
      }
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
      Actions={
        <>
          {!data.isNotice && data.isWriter && (
            <BellIcon
              boardId={currentBoard.id}
              postId={postId}
              isActive={data.isCommentAlertConsent}
            />
          )}
          {(!data.isNotice || data.isWriter) && (
            <MeatBallIcon onClick={onMenuOpen} />
          )}
        </>
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
