import { Link, useLocation } from 'react-router-dom';

import {
  FetchLoading,
  InfiniteScrollSentinel,
  List,
  PullToRefresh,
} from '@/shared/component';
import { BOARDS, NEW_ROUTES, ROLE } from '@/shared/constant';
import { useBoard } from '@/shared/hook';
import {
  deduplicatePaginatedData,
  flatPaginationCache,
  getBoard,
  getBoardTitleToTextId,
} from '@/shared/lib';

import { PostBar } from '@/feature/board/component';
import { useSearch } from '@/feature/search/hook';

import styles from './SearchResultList.module.css';

const NOTICE_BOARD_ID = getBoard('notice').id;

export default function SearchResultList() {
  const { pathname } = useLocation();
  const boardId = BOARDS.find(({ path }) => pathname.includes(path)).id;

  const {
    items: postList,
    ref,
    isFetchingNextPage,
    refetch,
  } = useSearch({
    boardId,
    getItemKey: (item) => item.postId,
  });

  return (
    <PullToRefresh onRefresh={refetch}>
      <List>
        {postList.map((post) => (
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
  const postList = deduplicatePaginatedData(flatPaginationCache(data));

  return (
    <PullToRefresh onRefresh={refetch}>
      <List>
        {postList.map((post, index) => (
          <Link
            className={styles.to}
            ref={index === postList.length - 1 ? ref : undefined}
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
