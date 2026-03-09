import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation, useParams } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getPostContent } from '@/apis';

import { BackAppBar, FetchLoading } from '@/shared/component';
import { getBoard } from '@/shared/lib';
import { QUERY_KEY } from '@/shared/constant';

import { useDeletePostHandler } from '@/feature/board/hook/useDeletePostHandler';
import { PostDetailView } from '@/feature/board/ui';
import { PostActionBar } from '@/feature/board/component';
import { CommentSection } from '@/feature/comment/component';
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
      deletePost={handleDelete}
      PostActionBar={(props) => (
        <PostActionBar>
          <PostActionBar.Comment {...props} />
          <PostActionBar.Like {...props} />
          <PostActionBar.Scrap {...props} />
        </PostActionBar>
      )}
      CommentSection={CommentSection}
      BellIcon={(isActive) => (
        <BellIcon
          boardId={currentBoard.id}
          postId={postId}
          isActive={isActive}
        />
      )}
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
