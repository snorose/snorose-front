import {
  isPickUpPending,
  isProductQuantityLimitReached,
  isRegistrationComplete,
  isValidPhoneNumber,
} from '@/feature/commerce/utils/commerceRules';

const product = {
  productId: 1,
  remainingForBuyer: 3,
};

describe('상품별 구매 가능 수량 제한', () => {
  it('동일 상품의 옵션 수량 합계가 remainingForBuyer에 도달하면 한도에 도달한 것으로 판단한다', () => {
    const quantityMap = {
      1: {
        1: 1,
        2: 2,
      },
    };

    expect(isProductQuantityLimitReached(product, quantityMap)).toBe(true);
  });

  it('옵션 수량 합계가 remainingForBuyer보다 작으면 한도에 도달하지 않은 것으로 판단한다', () => {
    const quantityMap = {
      1: {
        1: 1,
        2: 1,
      },
    };

    expect(isProductQuantityLimitReached(product, quantityMap)).toBe(false);
  });
});

describe('유효한 연락처', () => {
  it('010으로 시작하는 11자리 연락처는 유효하다', () => {
    const phoneNumber = '01011112222';

    expect(isValidPhoneNumber(phoneNumber)).toBe(true);
  });

  it('010으로 시작하지 않으면 유효하지 않다', () => {
    const phoneNumber = '01111112222';

    expect(isValidPhoneNumber(phoneNumber)).toBe(false);
  });

  it('010으로 시작하더라도 11자리가 아니면 유효하지 않다', () => {
    const phoneNumber = '0101111222';

    expect(isValidPhoneNumber(phoneNumber)).toBe(false);
  });
});

it('구매 수량 제한이 없는 상품은 잔여 구매 한도를 초과하지 않는다', () => {
  expect(
    isProductQuantityLimitReached(
      { productId: 1, remainingForBuyer: null },
      { 1: { 1: 0 } }
    )
  ).toBe(false);
  expect(
    isProductQuantityLimitReached(
      { productId: 1, remainingForBuyer: null },
      { 1: { 1: 3 } }
    )
  ).toBe(false);
});

describe('수령 절차가 없는 신청 상태', () => {
  it('입금 확인된 신청은 수령 대기가 아니라 신청 완료로 본다', () => {
    expect(isPickUpPending('ACTIVE', 'PAID', 'PENDING', true, 'NONE')).toBe(
      false
    );
    expect(isRegistrationComplete('ACTIVE', 'PAID', 'PENDING', 'NONE')).toBe(
      true
    );
  });

  it('입금 확인 없는 신청은 신청 즉시 완료로 보고, 취소되면 완료로 보지 않는다', () => {
    expect(isRegistrationComplete('ACTIVE', null, 'NOT_REQUIRED', 'NONE')).toBe(
      true
    );
    expect(
      isRegistrationComplete('CANCELLED', null, 'NOT_REQUIRED', 'NONE')
    ).toBe(false);
  });

  it('수령 절차가 있는 판매는 그대로 수령 대기로 본다', () => {
    expect(isPickUpPending('ACTIVE', 'PAID', 'PENDING', true, 'PICKUP')).toBe(
      true
    );
    expect(isRegistrationComplete('ACTIVE', 'PAID', 'PENDING', 'PICKUP')).toBe(
      false
    );
  });
});
