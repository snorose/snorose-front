import { Icon } from '@/shared/component';
import { LIKE_TYPE } from '@/shared/constant';

import { useCommentContext } from '@/feature/comment/context';
import { useLike } from '@/feature/like/hook';
import { useScrap } from '@/feature/scrap/hook';

import styles from './PostActionBar.module.css';

export default function PostActionBar({ children }) {
  return <div className={styles.container}>{children}</div>;
}

function CommentActionButton({ isNotice, commentCount }) {
  const { inputFocus, focusedItem } = useCommentContext();

  return (
    <div
      className={styles.count}
      styles={{
        display: isNotice ? 'none' : 'flex',
        backgroundColor:
          focusedItem === 'post' ? 'var(--blue-1)' : 'transparent',
      }}
      onClick={inputFocus}
    >
      <Icon
        id='comment-stroke'
        width={18}
        height={15}
        styles={{
          paddingTop: '0.1rem',
        }}
        stroke='var(--blue-3)'
        fill='none'
      />
      <p>댓글 {commentCount.toLocaleString()}</p>
    </div>
  );
}

function LikeActionButton({ postId, isLiked, likeCount }) {
  const { like, unlike } = useLike({
    type: LIKE_TYPE.post,
    sourceId: postId,
  });

  return (
    <div
      className={styles.count}
      onClick={() => (isLiked ? unlike.mutate() : like.mutate())}
    >
      <Icon
        id='like-stroke'
        width={16}
        height={15}
        stroke='var(--pink-2)'
        fill={isLiked ? 'var(--pink-2)' : 'none'}
      />
      <p>공감 {likeCount.toLocaleString()}</p>
    </div>
  );
}

function ScrapActionButton({ isScrapped, scrapCount }) {
  const { scrap, unscrap } = useScrap();

  return (
    <div
      className={styles.count}
      onClick={() => (isScrapped ? unscrap.mutate() : scrap.mutate())}
    >
      <Icon
        id='scrap-stroke'
        width={13}
        height={16}
        stroke={'var(--green-1)'}
        fill={isScrapped ? 'var(--green-1)' : 'none'}
      />
      <p>스크랩 {scrapCount.toLocaleString()}</p>
    </div>
  );
}

PostActionBar.Comment = CommentActionButton;
PostActionBar.Like = LikeActionButton;
PostActionBar.Scrap = ScrapActionButton;
