import { Link } from 'react-router-dom';

import { FetchLoading } from '@/shared/component';
import { STALE_TIME } from '@/shared/constant';
import { useSuspensePagination } from '@/shared/hook';
import {
  deduplicatePaginatedData,
  flatPaginationCache,
  getBoardTextId,
} from '@/shared/lib';

import { PostBar } from '@/feature/board/component';
import { ACTIVITIES } from '@/feature/my/constant';
import { INQUIRY_STATUS_MAP } from '@/feature/support/constant';

import {
  noCommentsIllustration,
  noPostsIllustration,
  noScrapedPostsIllustration,
} from '@/assets/illustrations';

import styles from './MyPostList.module.css';

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

  const makePath = ({ boardId, postId, isNotice, group }) => {
    if (group) {
      return `/${group.toLowerCase()}/${postId}`;
    }

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
          key={post.postId}
          className={styles.to}
          ref={index === list.length - 1 ? ref : undefined}
          to={makePath({ ...post })}
        >
          <PostBar {...post} content={post.questionDetail ?? post.content}>
            {post.boardName && (
              <PostBar.Chip name={post.boardName} variant='grey' />
            )}
            {post.status && (
              <PostBar.Chip
                name={INQUIRY_STATUS_MAP[post.status].label}
                variant={INQUIRY_STATUS_MAP[post.status].variant}
              />
            )}
            {post.isConfirmed && <PostBar.ConfirmedIcon />}
          </PostBar>
        </Link>
      ))}
      {isFetching && <FetchLoading />}
    </ul>
  );
}
