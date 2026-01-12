import { useLocation } from 'react-router-dom';
import { Icon, Badge } from '@/shared/component';
import { DateTime, renderTextWithLinks } from '@/shared/lib';
import { LIKE_TYPE, ROLE, SHOW_BADGE_PATH } from '@/shared/constant';

import { useCommentContext } from '@/feature/comment/context';
import { useLike } from '@/feature/like/hook';

import cloudLogo from '@/assets/images/cloudLogo.svg';

import styles from '@/feature/comment/component/Comment/Comment.module.css';
import { useRef } from 'react';

export default function NestedComment({
  data,
  isLast,
  isFirst,
  onCommentOptionClick,
}) {
  const nestedMoreOptionRef = useRef(null);
  const { pathname } = useLocation();
  const { commentId } = useCommentContext();
  const { like, unlike } = useLike({
    type: LIKE_TYPE.comment,
    sourceId: data.id,
  });

  const {
    userRoleId,
    userDisplay,
    isWriterWithdrawn,
    content,
    isLiked,
    likeCount,
    createdAt,
    isVisible,
    isUpdated,
    isDeleted,
    isWriter,
  } = data;

  // 뱃지가 보이는 ROLE
  const showBadge =
    userRoleId === ROLE.official ||
    (userRoleId === ROLE.admin &&
      SHOW_BADGE_PATH.some((path) => pathname.includes(path)));

  // 뱃지 보이는 곳에 유저가 댓글 신고 금지
  const blockAdminReport = !showBadge || isWriter;

  return (
    <div
      className={`${styles.nestedComment} ${isLast && styles.isLast} ${
        commentId === data.id ? styles.focused : ''
      }`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={styles.nestedCommentTop}>
        <div className={styles.commentTopLeft}>
          <div className={styles.nestedIcon}>
            {isFirst && <Icon id='nested-arrow' width={15} height={15} />}
          </div>
          <div className={styles.cloud}>
            <img className={styles.cloudLogoIcon} src={cloudLogo} alt='로고' />
          </div>
          <p className={`${isWriterWithdrawn && styles.isWriterWithdrawn}`}>
            {isWriterWithdrawn ? '(알 수 없음)' : userDisplay}
          </p>
          {showBadge && (
            <Badge userRoleId={userRoleId} className={styles.badge} />
          )}
          <p className={styles.dot}>·</p>
          <p>
            {DateTime.timeAgo(createdAt)} {isUpdated ? ' (수정됨)' : null}
          </p>
        </div>
        {!isDeleted && isVisible && blockAdminReport && (
          <p
            ref={nestedMoreOptionRef}
            className={styles.dot3}
            onClick={(e) => {
              onCommentOptionClick(data, nestedMoreOptionRef);
            }}
          >
            <Icon id='meat-ball' width={18} height={4} stroke='none' />
          </p>
        )}
      </div>
      <div className={styles.commentCenter}>
        <div
          className={`${styles.nestedPadding} ${(isDeleted || !isVisible) && styles.hide}`}
        >
          {!isDeleted &&
            (isVisible ? (
              <p className={styles.content}>{renderTextWithLinks(content)}</p>
            ) : (
              '(관리자에 의해 차단된 댓글입니다)'
            ))}
          {isDeleted && '(삭제된 댓글입니다)'}
        </div>
      </div>
      <div className={styles.commentBottom}>
        {!isDeleted && (
          <button
            className={styles.likedCount}
            type='button'
            onClick={() => (isLiked ? unlike.mutate() : like.mutate())}
          >
            <Icon
              id='like-stroke'
              width={16}
              height={18}
              stroke='var(--blue-3)'
              fill={isLiked ? 'var(--blue-3)' : 'none'}
            />
            <span>{likeCount.toLocaleString()}</span>
          </button>
        )}
      </div>
    </div>
  );
}
