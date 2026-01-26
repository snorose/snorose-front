import { Icon } from '@/shared/component';
import { DateTime } from '@/shared/lib';

import styles from './NoticeBar.module.css';

export default function NoticeBar({ data, onClick }) {
  const formattedDate = DateTime.format(data.createdAt, 'YMD');

  return (
    <div className={styles.post} onClick={onClick}>
      <div className={styles.post_top}>
        <p className={styles.title}>{data.title}</p>
      </div>
      <div className={styles.post_center}>
        <p className={styles.text}>{data.content}</p>
      </div>
      <div className={styles.postBottom}>
        <span>{formattedDate}</span>
        <div className={styles.postBottomRight}>
          <div className={styles.iconContainer}>
            <Icon id='like' width={14} height={13} fill='#D9D9D9' />
            <span className={styles.like_cnt}>
              {data.likeCount.toLocaleString()}
            </span>
          </div>
          <div className={styles.iconContainer}>
            <Icon id='bookmark-fill' width={11} height={13} fill='#D9D9D9' />
            <span className={styles.like_cnt}>
              {data.scrapCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
