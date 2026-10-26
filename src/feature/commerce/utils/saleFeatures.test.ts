import { getCashReceiptRequest, isCashReceiptOrderable } from './saleFeatures';
import {
  isCanceled,
  isPickedUp,
  isPickUpPending,
  isPaymentPending,
} from './commerceRules';

describe('판매별 신청 기능', () => {
  it('현금영수증 미사용 판매는 이전 입력이 남아 있어도 전송하지 않고 주문을 허용한다', () => {
    expect(getCashReceiptRequest(false, true, '01000000000', true)).toBeNull();
    expect(isCashReceiptOrderable(false, true, '', false)).toBe(true);
    expect(getCashReceiptRequest(true, true, '01000000000', true)).toEqual({
      phoneNumber: '01000000000',
      privacyConsent: true,
    });
    expect(isCashReceiptOrderable(true, true, '', false)).toBe(false);
  });
  it('입금 상태를 추적하지 않는 주문도 대기·완료·취소 상태를 표시한다', () => {
    expect(isPickUpPending('ACTIVE', null, 'PENDING', false)).toBe(true);
    expect(isPickedUp('COMPLETED', null, 'PICKED_UP', false)).toBe(true);
    expect(isCanceled('CANCELLED', null, false)).toBe(true);
    expect(isPaymentPending('ACTIVE', null, 'PENDING')).toBe(false);
  });
  it('신청 판매는 입금이 확인되어야 수령 대기로 표시한다', () => {
    expect(isPickUpPending('ACTIVE', null, 'PENDING')).toBe(false);
    expect(isPickUpPending('ACTIVE', 'WAITING', 'PENDING', true)).toBe(false);
    expect(isPickUpPending('ACTIVE', 'PAID', 'PENDING', true)).toBe(true);
    expect(isCanceled('CANCELLED', 'EXPIRED', true)).toBe(false);
  });
});
