import { render, screen } from '@testing-library/react';

import { ProductOptionItem } from './ProductOptionSection';

const soldOutOption = {
  productId: 1,
  productName: '스노로즈 반다나',
  variantId: 1,
  optionLabel: '네이비 · M',
  unitPrice: 8000,
  availableQuantity: 0,
};

describe('상품 옵션 재고 표시', () => {
  it('LIMITED_STOCK 옵션의 가용 수량이 0이면 품절을 표시한다', () => {
    render(
      <ProductOptionItem
        option={soldOutOption}
        quantity={0}
        onIncrease={jest.fn()}
        onDecrease={jest.fn()}
        increaseDisabled={false}
        decreaseDisabled={false}
        inventoryPolicy='LIMITED_STOCK'
      />
    );

    expect(screen.getByText('품절')).toBeInTheDocument();
  });
});
