import { DateTime } from '@/shared/lib';

import type { SaleResponse } from '@/feature/commerce/types';

import styles from '@/page/commerce/SaleDetailPage.module.css';

import { taskCompleteIllustration } from '@/assets/illustrations';

type SaleClosedSectionProps = {
  sale: SaleResponse;
  title: string;
  message: string;
};

export default function SaleClosedSection({
  sale,
  title,
  message,
}: SaleClosedSectionProps) {
  return (
    <section className={styles.closedSection} aria-labelledby='saleClosedTitle'>
      <img
        src={taskCompleteIllustration}
        alt=''
        aria-hidden='true'
        className={styles.closedIllustration}
      />

      <h2 id='saleClosedTitle' className={styles.closedTitle}>
        {title}
      </h2>
      <p className={styles.closedDescription}>{message}</p>

      <dl className={styles.closedInfoList}>
        <div className={styles.closedInfoItem}>
          <dt>마감일</dt>
          <dd>{DateTime.format(sale.closesAt, 'YMD_HM')}</dd>
        </div>
        <div className={styles.closedInfoItem}>
          <dt>판매자</dt>
          <dd>{sale.sellerName}</dd>
        </div>
      </dl>
    </section>
  );
}
