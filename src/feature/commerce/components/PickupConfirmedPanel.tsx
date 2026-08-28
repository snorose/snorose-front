import type { ConfirmPickupSessionResponse } from '@/feature/commerce/types';

import styles from '@/page/commerce/PickupDisplayPage.module.css';

type PickupConfirmedPanelProps = {
  pickup: ConfirmPickupSessionResponse;
};

export default function PickupConfirmedPanel({
  pickup,
}: PickupConfirmedPanelProps) {
  return (
    <section className={styles.panel} aria-live='assertive'>
      <div className={styles.statusBadge}>완료</div>
      <div className={styles.panelHeader}>
        <h1 className={styles.title}>수령 확인 완료</h1>
        <p className={styles.description}>{pickup.buyerName}님</p>
      </div>

      <div className={`${styles.itemList} ${styles.confirmedItemList}`}>
        {pickup.items.map((item, index) => (
          <div
            className={styles.item}
            key={`${item.productName}-${item.optionLabel}-${index}`}
          >
            <div className={styles.itemInfo}>
              <strong>{item.productName}</strong>
              <span>{item.optionLabel}</span>
            </div>
            <div className={styles.quantity}>{item.quantity}개</div>
          </div>
        ))}
      </div>

      <p className={styles.connectionMessage}>
        잠시 후 대기 화면으로 돌아갑니다.
      </p>
    </section>
  );
}
