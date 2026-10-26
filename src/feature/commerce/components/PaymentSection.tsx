import { PrimaryButton } from '@/shared/component';
import { formatNumber } from '@/shared/lib';

import { fulfillmentWord } from '@/feature/commerce/utils/saleLabels';
import type { FulfillmentMethod, SaleType } from '@/feature/commerce/types';

import styles from '@/page/commerce/SaleDetailPage.module.css';

type PaymentSectionProps = {
  autoPaymentEnabled?: boolean;
  saleType?: SaleType;
  fulfillmentMethod?: FulfillmentMethod;
  totalPaymentAmount: number;
  isOrderButtonDisabled: boolean;
  onClick: () => void;
};

export default function PaymentSection({
  autoPaymentEnabled = true,
  saleType,
  fulfillmentMethod,
  totalPaymentAmount,
  isOrderButtonDisabled,
  onClick,
}: PaymentSectionProps) {
  return (
    <section className={styles.paymentSection}>
      <div className={styles.totalPayment}>
        <h2 className={styles.sectionTitle}>총 결제 금액</h2>
        <strong className={styles.totalPaymentAmount}>
          {formatNumber(totalPaymentAmount)}원
        </strong>
      </div>

      <div className={styles.borderBottom}></div>

      <ul className={styles.paymentNoticeList}>
        <li>주문 후 안내되는 학생단체 계좌로 직접 입금합니다.</li>
        <li>
          {autoPaymentEnabled
            ? '입금 확인 전까지만 구매자가 취소할 수 있습니다.'
            : fulfillmentMethod === 'NONE'
              ? '신청 후 취소는 판매자에게 문의해주세요.'
              : `${fulfillmentWord(saleType)} 전까지 구매자가 취소할 수 있습니다.`}
        </li>
        {!autoPaymentEnabled && (
          <li>이 판매는 입금 상태 조회를 제공하지 않습니다.</li>
        )}
        <li>
          {fulfillmentMethod === 'NONE'
            ? autoPaymentEnabled
              ? '입금 확인 후 신청이 완료됩니다.'
              : '주문과 함께 신청이 완료됩니다.'
            : saleType === 'LECTURE'
              ? autoPaymentEnabled
                ? '입금 확인 후 강연 장소에서 입장을 확인합니다.'
                : '강연 장소에서 입장을 확인합니다.'
              : '배송 없이 지정 장소에서 수령합니다.'}
        </li>
      </ul>

      <div className={styles.button}>
        <PrimaryButton disabled={isOrderButtonDisabled} onClick={onClick}>
          {saleType === 'LECTURE' ? '신청하기' : '주문하기'}
        </PrimaryButton>
      </div>
    </section>
  );
}
