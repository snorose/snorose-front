import { fireEvent, render, screen } from '@testing-library/react';

import PaymentSection from './PaymentSection';
import PickupArmedPanel from './PickupArmedPanel';
import PickupConfirmedPanel from './PickupConfirmedPanel';

jest.mock('@/shared/component', () => ({
  PrimaryButton: (props) => <button {...props} />,
}));
jest.mock('@/shared/lib', () => ({ formatNumber: (value) => String(value) }));

const session = {
  state: 'ARMED' as const,
  sessionId: 1,
  expiresAt: '',
  remainingSeconds: 30,
  order: {
    buyerName: '테스트 참가자',
    studentNumber: '1234567',
    saleTitle: '강연',
    items: [{ productName: '강연 참가권', optionLabel: '일반', quantity: 1 }],
  },
};

it('강연은 참가권 대신 신청자 정보를 보여주고 본인 확인 완료를 누른다', () => {
  const onConfirm = jest.fn();
  const lecture = {
    ...session,
    order: { ...session.order, saleType: 'LECTURE' as const },
  };
  const { rerender } = render(
    <PickupArmedPanel
      session={lecture}
      isConfirming={false}
      onConfirm={onConfirm}
    />
  );
  expect(screen.getByRole('heading', { name: '강연' })).toBeInTheDocument();
  expect(screen.getByText('테스트 참가자')).toBeInTheDocument();
  expect(screen.getByText('1234567')).toBeInTheDocument();
  expect(screen.queryByText('강연 참가권')).not.toBeInTheDocument();
  expect(screen.queryByText('일반')).not.toBeInTheDocument();
  expect(screen.queryByText('1개')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '본인 확인 완료' }));
  expect(onConfirm).toHaveBeenCalledTimes(1);
  rerender(
    <PickupArmedPanel session={lecture} isConfirming onConfirm={onConfirm} />
  );
  expect(screen.getByRole('button', { name: '확인 중...' })).toBeDisabled();
});

it('물품 판매의 주문 항목과 수령 확인 문구는 유지한다', () => {
  render(
    <PickupArmedPanel
      session={session}
      isConfirming={false}
      onConfirm={jest.fn()}
    />
  );
  expect(
    screen.getByRole('button', { name: '내 주문이 맞아요 · 수령 확인' })
  ).toBeInTheDocument();
  expect(screen.getByText('강연 참가권')).toBeInTheDocument();
  expect(screen.getByText('일반')).toBeInTheDocument();
  expect(screen.getByText('1개')).toBeInTheDocument();
});

it('강연 완료 응답은 입장 확인 완료로 표시한다', () => {
  render(
    <PickupConfirmedPanel
      pickup={{
        state: 'CONFIRMED',
        saleType: 'LECTURE',
        buyerName: '참가자',
        items: session.order.items,
        autoResetSeconds: 3,
      }}
    />
  );
  expect(
    screen.getByRole('heading', { name: '입장 확인 완료' })
  ).toBeInTheDocument();
  expect(screen.queryByText(/수령/)).not.toBeInTheDocument();
  expect(screen.queryByText('강연 참가권')).not.toBeInTheDocument();
  expect(screen.queryByText('일반')).not.toBeInTheDocument();
  expect(screen.queryByText('1개')).not.toBeInTheDocument();
});

it('강연 신청 전 입장 방식을 안내한다', () => {
  render(
    <PaymentSection
      saleType='LECTURE'
      totalPaymentAmount={1000}
      isOrderButtonDisabled={false}
      onClick={jest.fn()}
    />
  );
  expect(
    screen.getByText('입금 확인 후 강연 장소에서 입장을 확인합니다.')
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '신청하기' })).toBeInTheDocument();
  expect(screen.queryByText(/수령/)).not.toBeInTheDocument();
});
