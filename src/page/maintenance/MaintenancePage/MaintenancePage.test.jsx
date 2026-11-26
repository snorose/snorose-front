import { fireEvent, render, screen } from '@testing-library/react';

import { setMaintenanceStatus } from '@/feature/maintenance';

import MaintenancePage from './MaintenancePage';

jest.mock(
  '@snorose/icons',
  () => ({
    IllustrationClipboardSearch: (props) => <svg {...props} />,
    IllustrationLogoSnoroseCloud: () => null,
  }),
  { virtual: true }
);

it('renders server notice fields and falls back when its image fails', () => {
  setMaintenanceStatus({
    inProgress: true,
    title: '정기 점검',
    noticeMessage: '업데이트 중입니다.\n잠시 기다려 주세요.',
    endAt: '2026-11-22 19:00:00',
    imageUrl: 'https://example.com/notice.png',
  });
  render(<MaintenancePage />);
  expect(screen.getByRole('heading', { name: '정기 점검' })).toBeVisible();
  expect(
    screen.getByText('서비스 이용 재개 예정 : 2026년 11월 22일 19:00')
  ).toBeVisible();

  expect(screen.getByText(/업데이트 중입니다/)).toBeVisible();
  fireEvent.error(screen.getByRole('img', { name: '서버 점검 안내' }));
  expect(screen.getByRole('img', { name: '서버 점검' })).toBeVisible();
});

it('renders the default notice without a fabricated end time', () => {
  setMaintenanceStatus({
    inProgress: true,
    title: null,
    noticeMessage: null,
    endAt: null,
    imageUrl: null,
  });
  render(<MaintenancePage />);
  expect(screen.getByRole('main', { name: '서버 점검 안내' })).toBeVisible();
  expect(screen.getByRole('heading')).toBeEmptyDOMElement();
  expect(screen.queryByText(/서비스 이용 재개 예정 :/)).not.toBeInTheDocument();
  expect(screen.getByText(/안정적인 서비스 제공/)).toBeVisible();
});
