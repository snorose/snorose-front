import { Link, useLocation, useSearchParams } from 'react-router-dom';

import {
  FetchLoading,
  InfiniteScrollSentinel,
  List,
  PullToRefresh,
} from '@/shared/component';
import { BOARD_CATEGORY_MAP, QUERY_KEY, STALE_TIME } from '@/shared/constant';
import { useSuspenseInfiniteScroll } from '@/shared/hook';
import { getBoard, getBoardTitleToTextId } from '@/shared/lib';

import { PostBar } from '@/feature/board/component';

import { getEventPosts, getPosts } from '@/apis';

import styles from './PostList.module.css';

export default function PostList() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const currentBoardTextId = pathname.split('/')[2];
  const currentBoard = getBoard(currentBoardTextId);
  const isBesookt = currentBoardTextId === 'besookt' ? true : false;
  const isEvent = currentBoardTextId === 'event' ? true : false;
  const progressType = searchParams.get('progressType') ?? 'ALL';

  // 페이지네이션 관련 hook (일반 / 이벤트 )
  const {
    items: postList,
    ref,
    isFetchingNextPage,
    refetch,
  } = useSuspenseInfiniteScroll({
    queryKey: isEvent
      ? [QUERY_KEY.events, currentBoard.id, progressType]
      : [QUERY_KEY.posts, currentBoard.id],
    queryFn: ({ pageParam }) =>
      isEvent
        ? getEventPosts({
            page: pageParam,
            progressType: progressType === 'ALL' ? undefined : progressType,
          })
        : getPosts(currentBoard.id, pageParam),
    staleTime: STALE_TIME.boardPostList,
    getItemKey: (item) => item.postId,
  });

  if (!postList.length) {
    return (
      <FetchLoading animation={false}>
        {isEvent
          ? progressType === 'ALL'
            ? '게시물이 없어요'
            : '해당 상태의 이벤트가 없어요'
          : '게시물이 없어요'}
      </FetchLoading>
    );
  }

  return (
    <div>
      <PullToRefresh onRefresh={refetch}>
        <List>
          {postList.map((post) => (
            <Link
              className={styles.to}
              key={post.postId}
              to={
                isBesookt
                  ? `/board/${getBoardTitleToTextId(post.boardName)}/post/${post.postId}`
                  : `/board/${currentBoardTextId}/post/${post.postId}`
              }
            >
              <PostBar
                {...post}
                category={BOARD_CATEGORY_MAP[currentBoard.id]?.[post.category]}
              >
                {post.boardName && (
                  <PostBar.Chip name={post.boardName} variant='grey' />
                )}
              </PostBar>
            </Link>
          ))}

          <InfiniteScrollSentinel ref={ref} />
          {isFetchingNextPage && <FetchLoading />}
        </List>
      </PullToRefresh>
    </div>
  );
}
