import { Link } from 'react-router-dom';

import { useSuspensePagination } from '@/shared/hook';
import { FetchLoading } from '@/shared/component';
import {
  getBoardTextId,
  deduplicatePaginatedData,
  flatPaginationCache,
} from '@/shared/lib';
import { STALE_TIME } from '@/shared/constant';

import { PostBar } from '@/feature/board/component';

import styles from './MyPostList.module.css';
import { ACTIVITIES } from '../../constant/activity';
import {
  noPostsIllustration,
  noScrapedPostsIllustration,
  noCommentsIllustration,
} from '@/assets/illustrations';

export default function MyPostList({
  queryKey,
  queryFn,
  hasLike = true,
  errorMessage,
}) {
  const { data, ref, isFetching } = useSuspensePagination({
    queryKey: [queryKey],
    queryFn: ({ pageParam }) => queryFn({ page: pageParam }),
    staleTime: STALE_TIME.mypageActivity,
  });

  const list = deduplicatePaginatedData(flatPaginationCache(data));

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
      {list.map((post, index) => (
        <Link
          className={styles.to}
          ref={index === list.length - 1 ? ref : undefined}
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
      {isFetching && <FetchLoading />}
    </ul>
  );
}
