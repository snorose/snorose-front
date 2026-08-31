import { render, screen } from '@testing-library/react';
import type { ButtonHTMLAttributes } from 'react';

import PickupArmedPanel from '@/feature/commerce/components/PickupArmedPanel';
import type { PickupDeviceSessionResponse } from '@/feature/commerce/types';

jest.mock('@/shared/component', () => ({
  PrimaryButton: ({
    children,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

describe('수령 단말 주문 확인 화면', () => {
  it('구매자의 전체 학번을 표시한다', () => {
    const session = {
      state: 'ARMED',
      sessionId: 1,
      expiresAt: '2026-08-31T12:01:00',
      remainingSeconds: 30,
      order: {
        buyerName: '김눈송',
        studentNumber: '2312345',
        saleTitle: '청파제 공식 굿즈',
        items: [],
      },
    } as unknown as Extract<PickupDeviceSessionResponse, { state: 'ARMED' }>;

    render(
      <PickupArmedPanel
        session={session}
        isConfirming={false}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByText('2312345')).toBeInTheDocument();
    expect(screen.queryByText(/\*|•/)).not.toBeInTheDocument();
  });
});
