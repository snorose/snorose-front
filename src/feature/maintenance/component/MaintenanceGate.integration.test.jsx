/* eslint-disable testing-library/no-unnecessary-act -- Flush asynchronous status requests triggered by focus and mount. */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { AxiosError, AxiosHeaders } from 'axios';

import { defaultAxios } from '@/axios';

import { getMaintenanceStatus, setMaintenanceStatus } from '../config';
import MaintenanceGate from './MaintenanceGate';

jest.mock('@/apis/userInfo', () => ({ getMyPageUserInfo: jest.fn() }));
jest.mock(
  '@snorose/icons',
  () => ({
    IllustrationClipboardSearch: (props) => <svg {...props} />,
    IllustrationLogoSnoroseCloud: () => null,
  }),
  { virtual: true }
);

const inactive = {
  inProgress: false,
  endAt: null,
  imageUrl: null,
  noticeMessage: null,
};
const active = {
  inProgress: true,
  title: '관리용 제목은 숨김',
  endAt: '2026-11-25 19:00:00',
  imageUrl: 'https://example.com/notice.jpg',
  noticeMessage: '등록한 안내 문구',
};
const originalAdapter = defaultAxios.defaults.adapter;
let response;

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-11-25T18:59:30+09:00'));
  localStorage.clear();
  setMaintenanceStatus(inactive);
  response = active;
  defaultAxios.defaults.adapter = jest.fn(async (config) => ({
    config,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data: { isSuccess: true, result: response },
  }));
});
afterEach(() => {
  defaultAxios.defaults.adapter = originalAdapter;
  jest.useRealTimers();
});

async function openPage() {
  await act(async () => {
    render(
      <MaintenanceGate>
        <button>서비스 화면</button>
      </MaintenanceGate>
    );
    fireEvent.focus(window);
  });
}

it('shows registered content to guests and restores service when the server ends maintenance', async () => {
  await openPage();
  expect(screen.getByText('등록한 안내 문구')).toBeVisible();
  expect(screen.getByRole('img', { name: '서버 점검 안내' })).toHaveAttribute(
    'src',
    active.imageUrl
  );
  expect(screen.queryByText('관리용 제목은 숨김')).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: '서비스 화면' })
  ).not.toBeInTheDocument();
  response = inactive;
  await act(async () => fireEvent.focus(window));
  expect(screen.getByRole('button', { name: '서비스 화면' })).toBeVisible();
});

it('restores service at the configured end even when polling fails', async () => {
  await openPage();
  defaultAxios.defaults.adapter = jest
    .fn()
    .mockRejectedValue(new Error('offline'));
  await act(async () => jest.advanceTimersByTime(30000));
  expect(screen.getByRole('button', { name: '서비스 화면' })).toBeVisible();
  expect(screen.queryByText('등록한 안내 문구')).not.toBeInTheDocument();
});

it('replaces a service error with the maintenance notice instead of leaving the network error screen', async () => {
  response = inactive;
  await openPage();
  response = active;
  await act(async () => {
    await defaultAxios
      .get('/v1/example', {
        adapter: async (config) => {
          throw new AxiosError('maintenance', undefined, config, undefined, {
            config,
            status: 503,
            statusText: 'Unavailable',
            headers: new AxiosHeaders(),
            data: { code: 2135 },
          });
        },
      })
      .catch(() => {});
  });
  expect(getMaintenanceStatus().inProgress).toBe(true);
  expect(screen.getByRole('main', { name: '서버 점검 안내' })).toBeVisible();
  expect(screen.getByText('등록한 안내 문구')).toBeVisible();
});
