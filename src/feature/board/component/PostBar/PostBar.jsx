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
    <div className={styles.post}>
      <div className={styles.thumbnailContainer}>
        <div className={styles.postBarLeft}>
          <div className={styles.postBarTop}>
            <img className={styles.cloudLogoIcon} src={cloudLogo} alt='로고' />
            <p className={styles.author}>{data.userDisplay}</p>
            {showBadge && (
              <Badge userRoleId={data.userRoleId} className={styles.badge} />
            )}
            <p className={styles.dot}>·</p>
            <p>{DateTime.formatAdaptive(data.createdAt)}</p>
            {data.isEdited && <p className={styles.edited}>&nbsp;(수정됨)</p>}
            {data.isConfirmed && (
              <Icon
                className={styles.checkCircleIcon}
                id='check-circle'
                width={12}
                height={12}
              />
            )}
            {data.boardName && <Chip type={'board'} label={data.boardName} />}
            {data.progressType && (
              <Chip type={'event'} label={data.progressType} />
            )}
          </div>
          <div className={styles.postBarCenter}>
            <p className={styles.title}>{data.title}</p>
            <div
              className={styles.text}
              dangerouslySetInnerHTML={{
                __html: data.questionDetail ?? data.content,
              }}
            />
          </div>
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
      <div>{userDisplay}</div>
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
          <div className={styles.action}>
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
