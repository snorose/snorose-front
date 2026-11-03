import { PrimaryButton } from '@/shared/component';

import type { PickupDeviceSessionResponse } from '@/feature/commerce/types';
import { fulfillmentWord } from '@/feature/commerce/utils/saleLabels';

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
  const isLecture = session.order.saleType === 'LECTURE';

  return (
    <section
      className={`${styles.panel} ${isLecture ? styles.lecturePanel : ''}`}
      aria-live='polite'
    >
      <div className={styles.statusBadge}>
        {fulfillmentWord(session.order.saleType)} 확인
      </div>

      <div className={styles.panelHeader}>
        <h1 className={styles.title}>{session.order.saleTitle}</h1>
        <div className={styles.buyerInfo}>
          <span className={styles.buyerName}>{session.order.buyerName}</span>
          {!isLecture && <span aria-hidden='true'>·</span>}
          <span className={styles.studentNumber}>
            {session.order.studentNumber}
          </span>
        </div>
      </div>

      {!isLecture && (
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
      )}

      <PrimaryButton
        className={styles.confirmButton}
        type='button'
        onClick={onConfirm}
        disabled={isConfirming}
      >
        {isConfirming
          ? '확인 중...'
          : isLecture
            ? '본인 확인 완료'
            : '내 주문이 맞아요 · 수령 확인'}
      </PrimaryButton>
    </section>
  );
}
