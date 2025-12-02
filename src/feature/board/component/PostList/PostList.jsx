import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { useSuspensePagination } from '@/shared/hook';
import { FetchLoading, List, PullToRefresh } from '@/shared/component';
import {
  getBoard,
  getBoardTitleToTextId,
  deduplicatePaginatedData,
  flatPaginationCache,
} from '@/shared/lib';
import { QUERY_KEY, STALE_TIME } from '@/shared/constant';

import { getEventPosts, getPosts } from '@/apis';
import { PostBar } from '@/feature/board/component';

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
  const { data, ref, isFetching, refetch } = useSuspensePagination({
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
  });

  const postList = deduplicatePaginatedData(flatPaginationCache(data));

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
      <PullToRefresh
        onRefresh={() => refetch().then(() => console.log('Refreshed!'))}
      >
        <List>
          {postList.map((post, index) => (
            <Link
              className={styles.to}
              key={post.postId}
              to={
                isBesookt
                  ? `/board/${getBoardTitleToTextId(post.boardName)}/post/${post.postId}`
                  : `/board/${currentBoardTextId}/post/${post.postId}`
              }
              ref={index === postList.length - 1 ? ref : undefined}
            >
              <PostBar data={{ ...post }} />
            </Link>
          ))}
          {isFetching && <FetchLoading />}
        </List>
      </PullToRefresh>
    </div>
  );
}
