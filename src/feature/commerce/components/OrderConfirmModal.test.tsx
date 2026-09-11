import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import OrderConfirmModal from '@/feature/commerce/components/OrderConfirmModal';

const items = [
  {
    productId: 1,
    productName: '스노로즈 반다나',
    variantId: 10,
    optionLabel: '네이비 · M',
    unitPrice: 8000,
    availableQuantity: 2,
    quantity: 2,
  },
];

describe('주문 제출 전 확인 모달', () => {
  beforeAll(() => {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal';
    document.body.append(modalRoot);
  });

  it('제출 전 상품·옵션·수량·총액·연락처를 보여준다', () => {
    render(
      <OrderConfirmModal
        selectedOrderItems={items}
        phoneNumber='01011112222'
        totalPaymentAmount={16000}
        isSubmitting={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByText('스노로즈 반다나')).toBeInTheDocument();
    expect(screen.getByText('네이비 · M X 2개')).toBeInTheDocument();
    expect(screen.getByText('16,000원')).toBeInTheDocument();
    expect(screen.getByText('010-1111-2222')).toBeInTheDocument();
  });
});
