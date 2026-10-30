import { CheckBox, NumberInput } from '@/shared/component';

import styles from '@/page/commerce/SaleDetailPage.module.css';

type CacheReceiptSectionProps = {
  isCacheReceiptHope: boolean;
  handleCacheReceiptHope: (checked: boolean) => void;
  cacheReceiptPhoneNumber: string;
  handleCacheReceiptPhoneNumber: (value: string) => void;
  isCacheReceiptAgree: boolean;
  handleCacheReceiptAgree: (checked: boolean) => void;
};

export default function CacheReceiptSection({
  isCacheReceiptHope,
  handleCacheReceiptHope,
  cacheReceiptPhoneNumber,
  handleCacheReceiptPhoneNumber,
  isCacheReceiptAgree,
  handleCacheReceiptAgree,
}: CacheReceiptSectionProps) {
  return (
    <section className={styles.cacheReceiptSection}>
      <div className={styles.sectionTitle}>현금 영수증</div>

      <div className={styles.checkItem}>
        <CheckBox
          id={'cache-receipt'}
          checked={isCacheReceiptHope}
          onChange={handleCacheReceiptHope}
        />
        <label
          className={styles.noticeAgreementLabel}
          htmlFor={'cache-receipt'}
        >
          <span className={styles.noticeRequiredBadge}>선택</span>
          <span className={styles.noticeAgreementText}>
            현금영수증 발행을 희망합니다.
          </span>
        </label>
      </div>

      {isCacheReceiptHope && (
        <>
          <div className={styles.checkItem}>
            <CheckBox
              id={'check'}
              checked={isCacheReceiptAgree}
              onChange={handleCacheReceiptAgree}
            />
            <label className={styles.noticeAgreementLabel} htmlFor={'check'}>
              <span className={styles.noticeRequiredBadge}>필수</span>
              <span className={styles.noticeAgreementText}>
                신청자는 입금자 본인이며, 본인이 기재한 개인정보를 스노로즈에서
                소득공제용 현금영수증 발급을 위하여 보관/사용하는 것에
                동의합니다
              </span>
            </label>
          </div>

          <div className={styles.filed}>
            <NumberInput
              id='phoneNumber'
              placeholder='- 제외 숫자만 입력'
              value={cacheReceiptPhoneNumber}
              onChange={handleCacheReceiptPhoneNumber}
              maxLength={11}
            />
          </div>
        </>
      )}
    </section>
  );
}
