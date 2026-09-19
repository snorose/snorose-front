import { IconBookmarkFill, IconHeartFill } from '@snorose/icons';

import { DateTime } from '@/shared/lib';

import { htmlToText } from '@/feature/editor/lib';

import styles from './NoticeBar.module.css';

export default function NoticeBar({ data, onClick }) {
  const formattedDate = DateTime.format(data.createdAt, 'YMD');
  const plainText = htmlToText(data.content);
  const { isLiked = false, isScrapped = false } = data;

  return (
    <div className={styles.post} onClick={onClick}>
      <div className={styles.post_top}>
        <p className={styles.title}>{data.title}</p>
      </div>
      <div className={styles.post_center}>
        <p className={styles.text}>{plainText}</p>
      </div>
      <div className={styles.postBottom}>
        <span>{formattedDate}</span>
        <div className={styles.postBottomRight}>
          <div className={styles.iconContainer}>
            <IconHeartFill
              width={14}
              height={13}
              color={isLiked ? 'var(--pink-2)' : 'var(--grey-3)'}
            />
            <span className={styles.like_cnt}>
              {(data.likeCount ?? 0).toLocaleString()}
            </span>
          </div>
          <div className={styles.iconContainer}>
            <IconBookmarkFill
              width={11}
              height={13}
              color={isScrapped ? 'var(--green-2)' : 'var(--grey-3)'}
            />
            <span className={styles.like_cnt}>
              {(data.scrapCount ?? 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
