import { PrimaryButton } from '@/shared/component';

import styles from '@/page/commerce/PickupDisplayPage.module.css';

type PickupIdlePanelProps = {
  connectionMessage?: string;
  onClearDevice: () => void;
};

export default function PickupIdlePanel({
  connectionMessage,
  onClearDevice,
}: PickupIdlePanelProps) {
  return (
    <section className={styles.panel} aria-live='polite'>
      <div className={styles.statusBadge}>대기</div>
      <div className={styles.panelHeader}>
        <h1 className={styles.title}>수령 확인 대기 중</h1>
        <p className={styles.description}>현재 표시할 주문이 없습니다.</p>
      </div>

      {connectionMessage && (
        <p className={styles.connectionMessage}>{connectionMessage}</p>
      )}

      <PrimaryButton
        className={styles.secondaryButton}
        type='button'
        onClick={onClearDevice}
      >
        다시 페어링
      </PrimaryButton>
    </section>
  );
}
