import type { Dispatch, SetStateAction } from 'react';

import { Label, NumberInput } from '@/shared/component';
import { useAuth } from '@/shared/hook';

import styles from '@/page/commerce/SaleDetailPage.module.css';

type OrdererInfoSectionProps = {
  phoneNumber: string;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
};

export default function OrdererInfoSection({
  phoneNumber,
  setPhoneNumber,
}: OrdererInfoSectionProps) {
  const { userInfo, status } = useAuth();

  const ordererName = status === 'loading' ? '불러오는 중' : userInfo?.userName;
  const studentNumber =
    status === 'loading' ? '불러오는 중' : userInfo?.studentNumber;

  return (
    <section className={styles.ordererSection}>
      <h2 className={styles.sectionTitle}>주문자 정보</h2>

      <div className={styles.ordererInfo}>
        <div className={styles.readonlyFieldList}>
          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>이름</span>
            <span className={styles.readonlyValue}>{ordererName ?? '-'}</span>
          </div>

          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>학번</span>
            <span className={styles.readonlyValue}>{studentNumber ?? '-'}</span>
          </div>
        </div>

        <div className={styles.phoneField}>
          <Label htmlFor='phoneNumber' required>
            전화번호
          </Label>
          <NumberInput
            id='phoneNumber'
            placeholder='- 제외 숫자만 입력'
            value={phoneNumber}
            onChange={setPhoneNumber}
            maxLength={11}
          />
        </div>
      </div>
    </section>
  );
}
