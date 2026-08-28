import { Label, NumberInput } from '@/shared/component';

import styles from '@/page/commerce/SaleDetailPage.module.css';

type OrdererInfoSectionProps = {
  name: string;
  studentNumber: string;
  phoneNumber: string;
  handlePhoneNumber: (value: string) => void;
};

export default function OrdererInfoSection({
  name,
  studentNumber,
  phoneNumber,
  handlePhoneNumber,
}: OrdererInfoSectionProps) {
  const isValidPhoneNumber = /^010\d{8}$/.test(phoneNumber);

  return (
    <section className={styles.ordererSection}>
      <h2 className={styles.sectionTitle}>주문자 정보</h2>

      <div className={styles.ordererInfo}>
        <div className={styles.readonlyFieldList}>
          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>이름</span>
            <span className={styles.readonlyValue}>{name}</span>
          </div>

          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>학번</span>
            <span className={styles.readonlyValue}>{studentNumber}</span>
          </div>
        </div>

        <div className={styles.phoneField}>
          <Label htmlFor='phoneNumber'>전화번호</Label>
          <div className={styles.fieldMessageWrapper}>
            <NumberInput
              id='phoneNumber'
              placeholder='- 제외 숫자만 입력'
              value={phoneNumber}
              onChange={handlePhoneNumber}
              maxLength={11}
            />
            {phoneNumber && !isValidPhoneNumber && (
              <div className={styles.message}>
                010으로 시작하는 11자리 숫자를 입력하세요
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
