import { isProductQuantityLimitReached } from '@/feature/commerce/utils/commerceRules';

const product = {
  productId: 1,
  remainingForBuyer: 3,
};

describe('상품별 구매 가능 수량 제한', () => {
  const quantityMap = {
    1: {
      1: 1,
      2: 2,
    },
  };

  it('동일 상품의 옵션 수량 합계가 remainingForBuyer에 도달하면 한도에 도달한 것으로 판단한다', () => {
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
