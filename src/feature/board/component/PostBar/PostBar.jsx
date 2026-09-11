import {
  IconBookmark,
  IconBookmarkFill,
  IconComment,
  IconHeart,
  IconHeartFill,
} from '@snorose/icons';

import { Badge, Chip, Icon } from '@/shared/component';
import { ROLE } from '@/shared/constant';
import { DateTime } from '@/shared/lib';

import { htmlToText } from '@/feature/editor/lib';
import { ConfirmedChip } from '@/feature/exam/component';

import altImage from '@/assets/images/altImage.png';
import cloudLogo from '@/assets/images/cloudLogo.svg';

import styles from './PostBar.module.css';

export default function PostBar({
  className,
  userRoleId,
  authorBadgeRoleId,
  userDisplay,
  createdAt,
  title,
  category,
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
      <Meta
        userRoleId={userRoleId}
        authorBadgeRoleId={authorBadgeRoleId}
        userDisplay={userDisplay}
        createdAt={createdAt}
      >
        {children}
      </Meta>

      <div className={styles.body}>
        <div className={styles.text}>
          <div className={styles.title}>
            {category &&
              !title?.startsWith(`[${category}]`) &&
              `[${category}] `}
            {title}
          </div>
          <div className={styles.content}>{htmlToText(content)}</div>
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

function Meta({
  userRoleId,
  authorBadgeRoleId,
  userDisplay,
  createdAt,
  children,
}) {
  const badgeRoleId = authorBadgeRoleId ?? userRoleId;
  const showBadge =
    badgeRoleId === ROLE.official ||
    (badgeRoleId === ROLE.admin && userDisplay !== '익명송이');

  return (
    <div className={styles.meta}>
      <img className={styles.cloudLogoIcon} src={cloudLogo} alt='로고' />
      <div className={styles.userDisplay} title={userDisplay || undefined}>
        {userDisplay}
      </div>
      {showBadge && <Badge userRoleId={badgeRoleId} width={16} height={16} />}
      <div className={styles.dot}>·</div>
      <div>{DateTime.formatAdaptive(createdAt)}</div>
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
      width: 14,
      height: 13,
      isActive: isLiked,
      color: 'var(--pink-2)',
      count: likeCount,
      ActiveIcon: IconHeartFill,
      DefaultIcon: IconHeart,
    },
    {
      width: 16,
      height: 13,
      color: 'var(--blue-3)',
      count: commentCount,
      ActiveIcon: IconComment,
      DefaultIcon: IconComment,
    },
    {
      width: 11,
      height: 13,
      isActive: isScrapped,
      color: 'var(--green-2)',
      count: scrapCount,
      ActiveIcon: IconBookmarkFill,
      DefaultIcon: IconBookmark,
    },
  ];

  return (
    <div className={styles.actionContainer}>
      {actions.map(
        ({
          iconId,
          width,
          height,
          isActive,
          color,
          count,
          ActiveIcon,
          DefaultIcon,
        }) => {
          if (count <= 0) return null;

          const IconComponent = isActive ? (
            <ActiveIcon width={width} height={height} color={color} />
          ) : (
            <DefaultIcon width={width} height={height} color={color} />
          );

          return (
            <div key={iconId} className={styles.action}>
              {IconComponent}
              <span>{count.toLocaleString()}</span>
            </div>
          );
        }
      )}
    </div>
  );
}

PostBar.Chip = Chip;
PostBar.ConfirmedChip = ConfirmedChip;
