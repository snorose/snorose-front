import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import useOrder from '@/feature/commerce/hooks/useOrder';

import OrderDetailPage from './OrderDetailPage';

jest.mock('@/feature/commerce/hooks/useOrder', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@/feature/commerce/hooks/useOrderCancel', () => () => ({
  mutate: jest.fn(),
  isPending: false,
}));
jest.mock('@/shared/hook', () => ({
  useToast: () => ({ toast: { success: jest.fn(), error: jest.fn() } }),
}));
jest.mock('@/shared/lib', () => ({
  ...jest.requireActual('@/shared/lib/number'),
  DateTime: jest.requireActual('@/shared/lib/date-time'),
}));
jest.mock('@/shared/component', () => ({
  BackAppBar: ({ title }) => <h1>{title}</h1>,
  PrimaryButton: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
  DimModalLayout: ({ children }) => <div>{children}</div>,
  FetchLoading: ({ children }) => <div>{children}</div>,
  ServerErrorFallback: () => <div>오류</div>,
}));

it('입금 조회 없이 즉시 완료된 신청도 입금 계좌를 안내한다', () => {
  (useOrder as jest.Mock).mockReturnValue({
    data: {
      orderNumber: 'SR-NONE',
      saleType: 'CAMPAIGN',
      orderStatus: 'COMPLETED',
      paymentStatus: null,
      fulfillmentStatus: 'NOT_REQUIRED',
      autoPaymentEnabled: false,
      cashReceiptEnabled: false,
      bank: {
        bankName: '테스트 은행',
        accountNumber: '00000000',
        accountHolder: '로컬 테스트',
      },
      totalAmount: 1000,
      paymentDueAt: '2026-10-27T12:00:00',
      pickup: { method: 'NONE' },
      items: [],
      cancellable: false,
    },
  });
  render(
    <MemoryRouter>
      <OrderDetailPage />
    </MemoryRouter>
  );
  expect(screen.getByText('테스트 은행 00000000')).toBeInTheDocument();
  expect(screen.getByText('신청 완료')).toBeInTheDocument();
  expect(screen.queryByText('입금 완료')).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: '주문 취소' })
  ).not.toBeInTheDocument();
});

const renderOrder = (overrides: Record<string, unknown>) => {
  (useOrder as jest.Mock).mockReturnValue({
    data: {
      orderNumber: 'SR-1',
      saleType: 'LECTURE',
      orderStatus: 'ACTIVE',
      paymentStatus: null,
      fulfillmentStatus: 'PENDING',
      autoPaymentEnabled: false,
      cashReceiptEnabled: false,
      bank: {
        bankName: '테스트 은행',
        accountNumber: '00000000',
        accountHolder: '로컬 테스트',
      },
      totalAmount: 5000,
      paymentDueAt: '2026-11-02T12:00:00',
      pickup: {
        method: 'PICKUP',
        pickupPlace: '백주년기념관 강당',
        pickupInstructions: null,
      },
      items: [],
      cancellable: true,
      ...overrides,
    },
  });
  render(
    <MemoryRouter>
      <OrderDetailPage />
    </MemoryRouter>
  );
};

it('입금 확인 없는 판매는 적용되지 않는 입금 기한과 빈 안내를 표시하지 않는다', () => {
  renderOrder({});
  expect(screen.getByText('테스트 은행 00000000')).toBeInTheDocument();
  expect(screen.getByText('백주년기념관 강당')).toBeInTheDocument();
  expect(screen.getByText('입장 대기')).toBeInTheDocument();
  expect(screen.queryByText('입금 기한')).not.toBeInTheDocument();
  expect(screen.queryByText('안내')).not.toBeInTheDocument();
});

it('수령 절차가 없는 판매는 입금 확인 후 수령 대기 대신 신청 완료로 표시한다', () => {
  renderOrder({
    saleType: 'CAMPAIGN',
    autoPaymentEnabled: true,
    paymentStatus: 'PAID',
    pickup: { method: 'NONE', pickupPlace: null, pickupInstructions: null },
    cancellable: false,
  });
  expect(screen.getByText('신청 완료')).toBeInTheDocument();
  expect(screen.queryByText('수령 대기')).not.toBeInTheDocument();
});

it('입금 확인 없는 신청은 진행 중이어도 신청 완료로 표시한다', () => {
  renderOrder({
    saleType: 'CAMPAIGN',
    fulfillmentStatus: 'NOT_REQUIRED',
    pickup: { method: 'NONE', pickupPlace: null, pickupInstructions: null },
    cancellable: false,
  });
  expect(screen.getByText('신청 완료')).toBeInTheDocument();
});
