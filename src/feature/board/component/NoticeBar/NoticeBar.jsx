import { Icon } from '@/shared/component';
import { DateTime } from '@/shared/lib';

import styles from './NoticeBar.module.css';

export default function NoticeBar({ data, onClick }) {
  const formattedDate = DateTime.format(data.createdAt, 'YMD');
  const plainText = data.content
  ?.replace(/<br\s*\/?>|<\/p>|&nbsp;/gi, ' ') // 줄바꿈, p 끝, &nbsp; → 공백
  ?.replace(/<[^>]+>/g, '')                  // 나머지 HTML 태그 제거
  ?.replace(/\s+/g, ' ')                     // 연속 공백 → 하나로
  ?.trim() ?? '';                             // 앞뒤 공백 제거

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
            <Icon id='like' width={14} height={13} fill='#D9D9D9' />
            <span className={styles.like_cnt}>
              {(data.likeCount ?? 0).toLocaleString()}
            </span>
          </div>
          <div className={styles.iconContainer}>
            <Icon id='bookmark-fill' width={11} height={13} fill='#D9D9D9' />
            <span className={styles.like_cnt}>
              {(data.scrapCount ?? 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
