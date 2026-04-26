import { Icon } from '@/shared/component';
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
            <Icon
              id='like'
              width={14}
              height={13}
              fill={isLiked ? 'var(--pink-2)' : 'var(--grey-3)'}
              stroke={isLiked ? 'var(--pink-2)' : 'var(--grey-3)'}
            />
            <span className={styles.like_cnt}>
              {(data.likeCount ?? 0).toLocaleString()}
            </span>
          </div>
          <div className={styles.iconContainer}>
            <Icon
              id='bookmark-fill'
              width={11}
              height={13}
              fill={isScrapped ? 'var(--green-2)' : 'var(--grey-3)'}
              stroke={isScrapped ? 'var(--green-2)' : 'var(--grey-3)'}
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
