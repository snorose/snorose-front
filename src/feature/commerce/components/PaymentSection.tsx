import { PrimaryButton } from '@/shared/component';
import { formatNumber } from '@/shared/lib';

import styles from '@/page/commerce/SaleDetailPage.module.css';

type PaymentSectionProps = {
  totalPaymentAmount: number;
  isPurchaseButtonDisabled: boolean;
  onPurchaseClick: () => void;
};

export default function PaymentSection({
  totalPaymentAmount,
  isPurchaseButtonDisabled,
  onPurchaseClick,
}: PaymentSectionProps) {
  return (
    <section className={styles.paymentSection}>
      <div className={styles.totalPayment}>
        <span className={styles.totalPaymentLabel}>총 결제 금액</span>
        <strong className={styles.totalPaymentAmount}>
          {formatNumber(totalPaymentAmount)}원
        </strong>
      </div>

      <ul className={styles.paymentNoticeList}>
        <li>주문 후 안내되는 학생단체 계좌로 직접 입금합니다.</li>
        <li>입금 확인 전까지만 구매자가 취소할 수 있습니다.</li>
        <li>배송 없이 지정 장소에서 수령합니다.</li>
      </ul>

      <PrimaryButton
        className={styles.purchaseButton}
        disabled={isPurchaseButtonDisabled}
        onClick={onPurchaseClick}
      >
        구매 결정하기
      </PrimaryButton>
    </section>
  );
}
