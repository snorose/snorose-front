import { BackAppBar } from '@/shared/component';
import { DateTime } from '@/shared/lib';

import { sale } from '@/dummy/data/sale';

import styles from './SaleDetailPage.module.css';

export default function SaleDetailPage() {
  return (
    <div className={styles.container}>
      <BackAppBar title='공구 상품' notFixed />

      <section className={styles.meta}>
        <span className={styles.sellerName}>{sale.sellerName}</span>
        <h1 className={styles.title}>{sale.title}</h1>
        <span className={styles.deadline}>
          {DateTime.format(sale.closesAt, 'MD_HM')} 판매 마감 ·
          {sale.pickup.instructions}
        </span>
      </section>
    </div>
  );
}
