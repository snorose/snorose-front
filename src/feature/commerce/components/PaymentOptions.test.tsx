import { render, screen } from '@testing-library/react';
import PaymentSection from './PaymentSection';
import OrderItem from './OrderItem';

jest.mock('@/shared/lib', () => jest.requireActual('@/shared/lib/number'));
jest.mock('@/shared/component', () => ({
  PrimaryButton: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
  Chip: ({ name }) => <span>{name}</span>,
}));

it('입금 조회 미신청 강연은 입장 전 취소 안내를 보여준다', () => {
  render(
    <PaymentSection
      saleType='LECTURE'
      fulfillmentMethod='PICKUP'
      autoPaymentEnabled={false}
      totalPaymentAmount={1000}
      isOrderButtonDisabled={false}
      onClick={jest.fn()}
    />
  );
  expect(
    screen.getByText('입장 전까지 구매자가 취소할 수 있습니다.')
  ).toBeInTheDocument();
  expect(screen.queryByText(/입금 확인 후/)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: '신청하기' })).toBeEnabled();
});

it.each(['PENDING', 'PICKED_UP'] as const)(
  '입금 조회가 꺼져도 %s 주문 상태를 표시한다',
  (fulfillmentStatus) => {
    render(
      <OrderItem
        orderNumber='SR-1'
        sellerName='운영팀'
        saleType='LECTURE'
        saleTitle='강연'
        thumbnailUrl=''
        itemSummary='참가권'
        totalAmount={1000}
        createdAt=''
        autoPaymentEnabled={false}
        orderStatus={fulfillmentStatus === 'PENDING' ? 'ACTIVE' : 'COMPLETED'}
        paymentStatus={null}
        fulfillmentStatus={fulfillmentStatus}
      />
    );
    expect(
      screen.getByText(
        fulfillmentStatus === 'PENDING' ? '입장 대기' : '입장 완료'
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/입금/)).not.toBeInTheDocument();
  }
);
