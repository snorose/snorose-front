import { Link, useLocation } from 'react-router-dom';

import {
  FetchLoading,
  InfiniteScrollSentinel,
  List,
  PullToRefresh,
} from '@/shared/component';
import { BOARDS, NEW_ROUTES, ROLE } from '@/shared/constant';
import { useBoard, useCultureBoard } from '@/shared/hook';
import {
  deduplicatePaginatedData,
  flatPaginationCache,
  getBoard,
  getBoardTitleToTextId,
  isCultureBoardPost,
} from '@/shared/lib';

import { PostBar } from '@/feature/board/component';
import { useSearch } from '@/feature/search/hook';

import styles from './SearchResultList.module.css';

const NOTICE_BOARD_ID = getBoard('notice').id;

export default function SearchResultList() {
  const { pathname } = useLocation();
  const boardId = BOARDS.find(({ path }) => pathname.includes(path)).id;
  const isCultureBoardOn = useCultureBoard();

  const {
    items: postList,
    ref,
    isFetchingNextPage,
    refetch,
  } = useSearch({
    boardId,
    getItemKey: (item) => item.postId,
  });

  // 미노출 게시판 게시글이 서버 응답에 섞여 들어오는 경우를 차단
  const visiblePostList = isCultureBoardOn
    ? postList
    : postList.filter((post) => !isCultureBoardPost(post));

  return (
    <PullToRefresh onRefresh={refetch}>
      <List>
        {visiblePostList.map((post) => (
          <Link
            className={styles.to}
            key={post.postId}
            to={`/board/${getBoardTitleToTextId(post.boardName)}/post/${post.postId}`}
          >
            <PostBar {...post} authorBadgeRoleId={getNoticeBadgeRoleId(post)}>
              <PostBar.Chip name={post.boardName} variant='grey' />
            </PostBar>
          </Link>
        ))}

        <InfiniteScrollSentinel ref={ref} />
        {isFetchingNextPage && <FetchLoading />}
      </List>
    </PullToRefresh>
  );
}

/**
 * TODO(global search): 새로 교체
 */
export function SearchResultListWrapper() {
  const { pathname } = useLocation();

  const isGlobalSearch = pathname.startsWith(NEW_ROUTES.globalSearch);

  if (isGlobalSearch) {
    return <NewSearchResultList boardId={0} />;
  }

  return <BoardSearchResultList />;
}

function BoardSearchResultList() {
  const { id } = useBoard();

  return <NewSearchResultList boardId={id} />;
}

function NewSearchResultList({ boardId }) {
  const { data, ref, isFetching, refetch } = useSearch({ boardId });
  const isCultureBoardOn = useCultureBoard();
  const postList = deduplicatePaginatedData(flatPaginationCache(data));

  // 미노출 게시판 게시글이 서버 응답에 섞여 들어오는 경우를 차단
  const visiblePostList = isCultureBoardOn
    ? postList
    : postList.filter((post) => !isCultureBoardPost(post));

  return (
    <PullToRefresh onRefresh={refetch}>
      <List>
        {visiblePostList.map((post, index) => (
          <Link
            className={styles.to}
            ref={index === visiblePostList.length - 1 ? ref : undefined}
            key={post.postId}
            to={`/board/${getBoardTitleToTextId(post.boardName)}/post/${post.postId}`}
          >
            <PostBar {...post} authorBadgeRoleId={getNoticeBadgeRoleId(post)}>
              <PostBar.Chip name={post.boardName} variant='grey' />
            </PostBar>
          </Link>
        ))}
        {isFetching && <FetchLoading />}
      </List>
    </PullToRefresh>
  );
}

function getNoticeBadgeRoleId(post) {
  const isNotice =
    post.isNotice ||
    Number(post.boardId) === NOTICE_BOARD_ID ||
    post.boardName === '공지사항';

  return isNotice ? ROLE.admin : undefined;
}
