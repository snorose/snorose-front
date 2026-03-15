import { Suspense, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation, useParams } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getPostContent } from '@/apis';

import { ModalContext } from '@/shared/context/ModalContext';
import { BackAppBar, FetchLoading } from '@/shared/component';
import { getBoard } from '@/shared/lib';
import { QUERY_KEY } from '@/shared/constant';

import { useDeletePostHandler } from '@/feature/board/hook/useDeletePostHandler';
import { PostDetailView } from '@/feature/board/ui';
import { MeatBallIcon, PostActionBar } from '@/feature/board/component';
import { CommentInputContainer } from '@/feature/comment/component';
import { BellIcon } from '@/feature/alert/component';

import { NotFoundPage } from '@/page/etc';

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
