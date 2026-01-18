import { Badge, Icon } from '@/shared/component';
import { ROLE } from '@/shared/constant';
import { DateTime } from '@/shared/lib';
import { Chip } from '@/feature/board/component';
import altImage from '@/assets/images/altImage.png';
import cloudLogo from '@/assets/images/cloudLogo.svg';

import styles from './PostBar.module.css';

export default function PostBar({ data, hasComment = true, hasLike = true }) {
  // 뱃지가 보이는 ROLE
  const showBadge =
    data.userRoleId === ROLE.official ||
    (data.userRoleId === ROLE.admin && data.userDisplay !== '익명송이');

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
            <p className={styles.text}>{data.questionDetail ?? data.content}</p>
          </div>
        </div>

        {data.hasMediaAttachment && (
          <div className={styles.thumbnail}>
            <img
              className={styles.thumbnailImg}
              src={data.thumbnailUrl || altImage}
              loading='lazy'
              onError={(e) => {
                e.currentTarget.src = altImage;
              }}
            />
          </div>
        )}
      </div>

      <div className={styles.postBarBottom}>
        <div className={styles.iconListContainer}>
          {data.likeCount > 0 && (
            <div className={styles.iconContainer}>
              <Icon
                id='like-stroke'
                width={14}
                height={13}
                fill={data.isLiked ? 'var(--pink-2)' : 'none'}
                stroke={'var(--pink-2)'}
              />
              <span>{data.likeCount.toLocaleString()}</span>
            </div>
          )}
          {data.commentCount > 0 && (
            <div className={styles.iconContainer}>
              <Icon
                className={styles.comment}
                id='comment-stroke'
                width={16}
                height={13}
                fill='none'
                stroke={'var(--blue-3)'}
              />
              <span>{data.commentCount.toLocaleString()}</span>
            </div>
          )}
          {data.scrapCount > 0 && (
            <div className={styles.iconContainer}>
              <Icon
                id='scrap-stroke'
                width={11}
                height={13}
                fill={data.isScrapped ? 'var(--green-2)' : 'none'}
                stroke={'var(--green-2)'}
              />
              <span>{data?.scrapCount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
