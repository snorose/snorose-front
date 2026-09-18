import { useState } from 'react';

import {
  IconBookmark,
  IconBookmarkFill,
  IconComment,
  IconHeart,
  IconHeartFill,
} from '@snorose/icons';

import { Icon } from '@/shared/component';
import { LIKE_TYPE } from '@/shared/constant';

import { useCommentContext } from '@/feature/comment/context';
import { useLike } from '@/feature/like/hook';
import { useScrap } from '@/feature/scrap/hook';

import styles from './PostActionBar.module.css';

export default function PostActionBar({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export function CommentActionButton({ isNotice, commentCount }) {
  const { inputFocus, focusedItem } = useCommentContext();

  return (
    <div
      className={styles.count}
      style={{
        display: isNotice ? 'none' : 'flex',
        backgroundColor:
          focusedItem === 'post' ? 'var(--blue-1)' : 'transparent',
      }}
      onClick={inputFocus}
    >
      <IconComment
        width={18}
        height={15}
        color={'var(--blue-3)'}
        style={{
          paddingTop: '0.1rem',
        }}
      />
      <p>댓글 {commentCount.toLocaleString()}</p>
    </div>
  );
}

function LikeActionButton({ postId, isLiked, likeCount }) {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(null);
  const { like, unlike } = useLike({
    type: LIKE_TYPE.post,
    sourceId: postId,
  });

  const displayedIsLiked = optimisticIsLiked ?? isLiked;
  const IconComponent = displayedIsLiked ? IconHeartFill : IconHeart;

  const handleLikeClick = () => {
    if (displayedIsLiked) {
      setIsLikeAnimating(false);
      setOptimisticIsLiked(false);
      unlike.mutate(undefined, {
        onSuccess: () => setOptimisticIsLiked(null),
        onError: () => setOptimisticIsLiked(null),
      });
      return;
    }

    setOptimisticIsLiked(true);
    setIsLikeAnimating(true);
    like.mutate(undefined, {
      onSuccess: () => setOptimisticIsLiked(null),
      onError: () => {
        setOptimisticIsLiked(null);
        setIsLikeAnimating(false);
      },
    });
  };

  return (
    <div className={styles.count} onClick={handleLikeClick}>
      <IconComponent
        className={
          displayedIsLiked && isLikeAnimating ? styles.heartLiked : styles.heart
        }
        width={16}
        height={15}
        color={'var(--pink-2)'}
        onAnimationEnd={() => setIsLikeAnimating(false)}
      />
      <p>공감 {likeCount.toLocaleString()}</p>
    </div>
  );
}

function ScrapActionButton({ isScrapped, scrapCount }) {
  const { scrap, unscrap } = useScrap();
  const IconComponent = isScrapped ? IconBookmarkFill : IconBookmark;

  return (
    <div
      className={styles.count}
      onClick={() => (isScrapped ? unscrap.mutate() : scrap.mutate())}
    >
      <IconComponent width={13} height={16} color={'var(--green-2)'} />
      <p>스크랩 {scrapCount.toLocaleString()}</p>
    </div>
  );
}

PostActionBar.Comment = CommentActionButton;
PostActionBar.Like = LikeActionButton;
PostActionBar.Scrap = ScrapActionButton;
