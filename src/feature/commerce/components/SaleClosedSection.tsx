import { DateTime } from '@/shared/lib';

import type { SaleResponse } from '@/feature/commerce/types';

import styles from '@/page/commerce/SaleDetailPage.module.css';

import { taskCompleteIllustration } from '@/assets/illustrations';

export default function SaleClosedSection({ sale }: { sale: SaleResponse }) {
  return (
    <section className={styles.closedSection} aria-labelledby='saleClosedTitle'>
      <img
        src={taskCompleteIllustration}
        alt=''
        aria-hidden='true'
        className={styles.closedIllustration}
      />

      <h2 id='saleClosedTitle' className={styles.closedTitle}>
        판매가 마감되었어요
      </h2>
      <p className={styles.closedDescription}>
        이 상품은 새 주문을 받을 수 없어요. 기존 주문과 수령 안내는 판매자의
        공지를 확인해주세요.
      </p>

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
