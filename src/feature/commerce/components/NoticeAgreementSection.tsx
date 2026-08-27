import { type Dispatch, type SetStateAction } from 'react';

import { CheckBox } from '@/shared/component';

import type {
  NoticeAcceptanceMap,
  SaleResponse,
} from '@/feature/commerce/types';

import styles from '@/page/commerce/SaleDetailPage.module.css';

type NoticeAgreementSectionProps = {
  notices: SaleResponse['notices'];
  noticeAcceptanceMap: NoticeAcceptanceMap;
  setNoticeAcceptanceMap: Dispatch<SetStateAction<NoticeAcceptanceMap>>;
};

export default function NoticeAgreementSection({
  notices,
  noticeAcceptanceMap,
  setNoticeAcceptanceMap,
}: NoticeAgreementSectionProps) {
  const handleNoticeAcceptanceChange = (
    noticeId: number,
    accepted: boolean
  ) => {
    setNoticeAcceptanceMap((prev) => ({
      ...prev,
      [noticeId]: accepted,
    }));
  };

  return (
    <section className={styles.noticeAgreementSection}>
      <h2 className={styles.sectionTitle}>유의사항 확인 및 동의</h2>

      <div className={styles.noticeAgreementList}>
        {notices.map((notice) => {
          const inputId = `commerceNotice${notice.noticeId}`;

          return (
            <div className={styles.noticeAgreementItem} key={notice.noticeId}>
              <CheckBox
                id={inputId}
                checked={Boolean(noticeAcceptanceMap[notice.noticeId])}
                onChange={(accepted) =>
                  handleNoticeAcceptanceChange(notice.noticeId, accepted)
                }
              />
              <label className={styles.noticeAgreementLabel} htmlFor={inputId}>
                {notice.required && (
                  <span className={styles.noticeRequiredBadge}>필수</span>
                )}
                <span className={styles.noticeAgreementText}>
                  {notice.text}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );
}
