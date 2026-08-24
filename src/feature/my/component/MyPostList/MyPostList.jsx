import { Link } from 'react-router-dom';

import { FetchLoading, InfiniteScrollSentinel } from '@/shared/component';
import { STALE_TIME } from '@/shared/constant';
import { useSuspenseInfiniteScroll } from '@/shared/hook';
import { getBoardTextId } from '@/shared/lib';

import { PostBar } from '@/feature/board/component';

import {
  noCommentsIllustration,
  noPostsIllustration,
  noScrapedPostsIllustration,
} from '@/assets/illustrations';

import { ACTIVITIES } from '../../constant/activity';
import styles from './MyPostList.module.css';

export default function MyPostList({
  queryKey,
  queryFn,
  hasLike = true,
  errorMessage,
}) {
  const {
    items: list,
    ref,
    isFetchingNextPage,
  } = useSuspenseInfiniteScroll({
    queryKey: [queryKey],
    queryFn: ({ pageParam }) => queryFn({ page: pageParam }),
    staleTime: STALE_TIME.mypageActivity,
    getItemKey: (item) => item.postId,
  });

  const activity = ACTIVITIES.find(
    (activity) => activity.queryKey === queryKey
  );

  const emptyStateIllustration =
    activity?.emptyStateIllustration || 'noScrapedPostsIllustration';

  const illustrationMap = {
    noPostsIllustration,
    noScrapedPostsIllustration,
    noCommentsIllustration,
  };

  if (list.length === 0) {
    return (
      <div className={styles.noContentWrapper}>
        <p className={styles.noContentMessage}>{errorMessage}</p>
        <div className={styles.imageWrapper}>
          <img
            src={illustrationMap[emptyStateIllustration]}
            width={220}
            height={182}
            alt={`${errorMessage}를 알리는 일러스트`}
          />
        </div>
      </div>
    );
  }

  const makePath = ({ boardId, postId, isNotice }) => {
    if (boardId === 14) {
      return isNotice
        ? `/board/event-notice/post/${postId}`
        : `/board/event/post/${postId}`;
    }

    if (boardId) {
      return `/board/${getBoardTextId(boardId)}/post/${postId}`;
    }

    return `/board/exam-review/post/${postId}`;
  };

  return (
    <ul className={styles.posts}>
      {list.map((post) => (
        <Link
          className={styles.to}
          key={post.postId}
          to={makePath({
            boardId: post.boardId,
            postId: post.postId,
            isNotice: post.isNotice,
          })}
        >
          <PostBar {...post} content={post.questionDetail ?? post.content}>
            {post.boardName && (
              <PostBar.Chip name={post.boardName} variant='grey' />
            )}
          </PostBar>
        </Link>
      ))}

      <InfiniteScrollSentinel ref={ref} />
      {isFetchingNextPage && <FetchLoading />}
    </ul>
  );
}
