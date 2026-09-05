import { Link } from 'react-router-dom';

import {
  IllustrationCommentEmpty,
  IllustrationPostEmpty,
  IllustrationScrapPostEmpty,
} from '@snorose/icons';

import { FetchLoading, InfiniteScrollSentinel } from '@/shared/component';
import { STALE_TIME } from '@/shared/constant';
import { useSuspenseInfiniteScroll } from '@/shared/hook';
import { getBoardTextId } from '@/shared/lib';

import { PostBar } from '@/feature/board/component';
import { ACTIVITIES } from '@/feature/my/constant';
import { INQUIRY_STATUS_MAP } from '@/feature/support/constant';

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

  // TODO: 호출부에서 빈 상태 일러스트 컴포넌트를 직접 넘기도록 리팩토링하면 이 매핑을 제거한다.
  const illustrationMap = {
    noPostsIllustration: IllustrationPostEmpty,
    noScrapedPostsIllustration: IllustrationScrapPostEmpty,
    noCommentsIllustration: IllustrationCommentEmpty,
  };
  const EmptyIllustration = illustrationMap[emptyStateIllustration];

  if (list.length === 0) {
    return (
      <div className={styles.noContentWrapper}>
        <p className={styles.noContentMessage}>{errorMessage}</p>
        <div className={styles.imageWrapper}>
          <EmptyIllustration
            width={220}
            height={182}
            role='img'
            aria-label={`${errorMessage}를 알리는 일러스트`}
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
      {list.map((post) => (
        <Link
          key={post.postId}
          className={styles.to}
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
            {post.isConfirmed && <PostBar.ConfirmedChip />}
          </PostBar>
        </Link>
      ))}

      <InfiniteScrollSentinel ref={ref} />
      {isFetchingNextPage && <FetchLoading />}
    </ul>
  );
}
