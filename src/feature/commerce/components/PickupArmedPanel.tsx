import { PrimaryButton } from '@/shared/component';

import type { PickupDeviceSessionResponse } from '@/feature/commerce/types';

import styles from '@/page/commerce/PickupDisplayPage.module.css';

type ArmedPickupSession = Extract<
  PickupDeviceSessionResponse,
  { state: 'ARMED' }
>;

type PickupArmedPanelProps = {
  session: ArmedPickupSession;
  isConfirming: boolean;
  onConfirm: () => void;
};

export default function PickupArmedPanel({
  session,
  isConfirming,
  onConfirm,
}: PickupArmedPanelProps) {
  return (
    <section className={styles.panel} aria-live='polite'>
      <div className={styles.statusBadge}>수령 확인</div>

      <div className={styles.panelHeader}>
        <h1 className={styles.title}>{session.order.saleTitle}</h1>
        <div className={styles.buyerInfo}>
          <span>{session.order.buyerName}</span>
          <span aria-hidden='true'>·</span>
          <span>{session.order.studentNumberMasked}</span>
        </div>
      </div>

      <div className={`${styles.itemList} ${styles.armedItemList}`}>
        {session.order.items.map((item, index) => (
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

      <PrimaryButton
        className={styles.confirmButton}
        type='button'
        onClick={onConfirm}
        disabled={isConfirming}
      >
        {isConfirming ? '확인 중...' : '내 주문이 맞아요 · 수령 확인'}
      </PrimaryButton>
    </section>
  );
}
