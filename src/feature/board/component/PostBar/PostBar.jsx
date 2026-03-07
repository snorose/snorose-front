import { Badge, Chip, Icon } from '@/shared/component';
import { DateTime } from '@/shared/lib';
import { ROLE } from '@/shared/constant';

import { ConfirmedIcon } from '@/feature/exam/component';

import altImage from '@/assets/images/altImage.png';
import cloudLogo from '@/assets/images/cloudLogo.svg';

import styles from './PostBar.module.css';

export default function PostBar({
  className,
  userRoleId,
  userDisplay,
  createdAt,
  isEdited,
  title,
  content,
  hasMediaAttachment,
  thumbnailUrl,
  likeCount,
  commentCount,
  scrapCount,
  isLiked,
  isScrapped,
  children,
}) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.body}>
        <div>
          <Meta
            userRoleId={userRoleId}
            userDisplay={userDisplay}
            createdAt={createdAt}
            isEdited={isEdited}
          >
            {children}
          </Meta>

          <div className={styles.title}>{title}</div>
          <div className={styles.content}>{content}</div>
        </div>

        {hasMediaAttachment && <Thumbnail thumbnailUrl={thumbnailUrl} />}
      </div>

      <ActionContainer
        likeCount={likeCount}
        commentCount={commentCount}
        scrapCount={scrapCount}
        isLiked={isLiked}
        isScrapped={isScrapped}
      />
    </div>
  );
}

function Meta({ userRoleId, userDisplay, createdAt, isEdited, children }) {
  const showBadge =
    userRoleId === ROLE.official ||
    (userRoleId === ROLE.admin && userDisplay !== '익명송이');

  return (
    <div className={styles.meta}>
      <img className={styles.cloudLogoIcon} src={cloudLogo} alt='로고' />
      <div className={styles.userDisplay}>{userDisplay}</div>
      {showBadge && <Badge className={styles.badge} userRoleId={userRoleId} />}
      <div className={styles.dot}>·</div>
      <div>{DateTime.formatAdaptive(createdAt)}</div>
      {isEdited && <div>(수정됨)</div>}
      {children}
    </div>
  );
}

function Thumbnail({ thumbnailUrl }) {
  return (
    <div className={styles.thumbnail}>
      <img
        className={styles.thumbnailImg}
        src={thumbnailUrl || altImage}
        loading='lazy'
        alt={'thumbnail'}
        onError={(e) => {
          e.currentTarget.src = altImage;
        }}
      />
    </div>
  );
}

function ActionContainer({
  likeCount = 0,
  commentCount = 0,
  scrapCount = 0,
  isLiked = false,
  isScrapped = false,
}) {
  const actions = [
    {
      iconId: 'like-stroke',
      width: 14,
      height: 13,
      isActive: isLiked,
      color: 'var(--pink-2)',
      count: likeCount,
    },
    {
      iconId: 'comment-stroke',
      width: 16,
      height: 13,
      color: 'var(--blue-3)',
      count: commentCount,
    },
    {
      iconId: 'scrap-stroke',
      width: 11,
      height: 13,
      isActive: isScrapped,
      color: 'var(--green-2)',
      count: scrapCount,
    },
  ];

  return (
    <div className={styles.actionContainer}>
      {actions.map(({ iconId, width, height, isActive, color, count }) => {
        if (count <= 0) return null;

        return (
          <div key={iconId} className={styles.action}>
            <Icon
              id={iconId}
              width={width}
              height={height}
              fill={isActive ? color : 'none'}
              stroke={color}
            />
            <span>{count.toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
}

PostBar.Chip = Chip;
PostBar.ConfirmedIcon = ConfirmedIcon;
