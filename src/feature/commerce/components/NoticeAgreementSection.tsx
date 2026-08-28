import { CheckBox } from '@/shared/component';

import type {
  NoticeAcceptanceMap,
  SaleResponse,
} from '@/feature/commerce/types';

import styles from '@/page/commerce/SaleDetailPage.module.css';

type NoticeAgreementSectionProps = {
  notices: SaleResponse['notices'];
  noticeAcceptanceMap: NoticeAcceptanceMap;
  handleNoticeAcceptance: (noticeId: string, accepted: boolean) => void;
};

export default function NoticeAgreementSection({
  notices,
  noticeAcceptanceMap,
  handleNoticeAcceptance,
}: NoticeAgreementSectionProps) {
  return (
    <section className={styles.noticeAgreementSection}>
      <h2 className={styles.sectionTitle}>유의사항 확인 및 동의</h2>

      <div className={styles.noticeAgreementList}>
        {notices.map((notice) => {
          const inputId = `commerceNotice-${notice.text}`;

          return (
            <div className={styles.noticeAgreementItem} key={inputId}>
              <CheckBox
                id={inputId}
                checked={Boolean(noticeAcceptanceMap[notice.text])}
                onChange={(accepted) =>
                  handleNoticeAcceptance(notice.text, accepted)
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
