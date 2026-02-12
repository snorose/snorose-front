import { useLocation, Link } from 'react-router-dom';

import { useBoard } from '@/shared/hook';
import { FetchLoading, List, PullToRefresh } from '@/shared/component';
import {
  getBoardTitleToTextId,
  deduplicatePaginatedData,
  flatPaginationCache,
} from '@/shared/lib';
import { NEW_ROUTES, BOARDS } from '@/shared/constant';

import { useSearch } from '@/feature/search/hook';
import { PostBar } from '@/feature/board/component';

import styles from './SearchResultList.module.css';

export default function SearchResultList() {
  const { pathname } = useLocation();
  const boardId = BOARDS.find(({ path }) => pathname.includes(path)).id;

  const { data, ref, isFetching, refetch } = useSearch({ boardId });
  const postList = deduplicatePaginatedData(flatPaginationCache(data));

  return (
    <PullToRefresh
      onRefresh={() => refetch().then(() => console.log('Refreshed!'))}
    >
      <List>
        {postList.map((post, index) => (
          <Link
            className={styles.to}
            ref={index === postList.length - 1 ? ref : undefined}
            key={post.postId}
            to={`/board/${getBoardTitleToTextId(post.boardName)}/post/${post.postId}`}
          >
            <PostBar data={post} />
          </Link>
        ))}
        {isFetching && <FetchLoading />}
      </List>
    </PullToRefresh>
  );
}

/**
 * TODO: 새로 교체
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
    <PullToRefresh
      onRefresh={() => refetch().then(() => console.log('Refreshed!'))}
    >
      <List>
        {postList.map((post, index) => (
          <Link
            className={styles.to}
            ref={index === postList.length - 1 ? ref : undefined}
            key={post.postId}
            to={`/board/${getBoardTitleToTextId(post.boardName)}/post/${post.postId}`}
          >
            <PostBar data={post} />
          </Link>
        ))}
        {isFetching && <FetchLoading />}
      </List>
    </PullToRefresh>
  );
}
