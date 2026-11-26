import { useState, useSyncExternalStore } from 'react';

import {
  IllustrationClipboardSearch,
  IllustrationLogoSnoroseCloud,
} from '@snorose/icons';

import {
  getMaintenanceStatus,
  subscribeMaintenanceStatus,
} from '@/feature/maintenance';

import styles from './MaintenancePage.module.css';

export default function MaintenancePage() {
  const { title, endAt, noticeMessage, imageUrl } = useSyncExternalStore(
    subscribeMaintenanceStatus,
    getMaintenanceStatus
  );
  const [failedImage, setFailedImage] = useState(null);
  return (
    <main className={styles.main} aria-label='서버 점검 안내'>
      {imageUrl && failedImage !== imageUrl ? (
        <img
          className={styles.noticeImage}
          src={imageUrl}
          alt='서버 점검 안내'
          onError={() => setFailedImage(imageUrl)}
        />
      ) : (
        <IllustrationClipboardSearch role='img' aria-label='서버 점검' />
      )}
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.text}>
        {endAt && (
          <p className={styles.date}>
            서비스 이용 재개 예정 :{' '}
            {endAt
              .replace('T', ' ')
              .slice(0, 16)
              .replace(/^(\d{4})-(\d{2})-(\d{2}) /, '$1년 $2월 $3일 ')}
          </p>
        )}
        <p className={styles.content}>
          {noticeMessage ??
            '안정적인 서비스 제공을 위한 서버 점검을 하고 있어요.\n이용에 불편을 드리게 된 점 양해 부탁드립니다.'}
        </p>
      </div>
      <IllustrationLogoSnoroseCloud
        className={styles.logo}
        width={221}
        height={25}
      />
    </main>
  );
}
