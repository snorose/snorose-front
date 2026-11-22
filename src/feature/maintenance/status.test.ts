import { AxiosError, AxiosHeaders } from 'axios';

import { authAxios, defaultAxios } from '@/axios';

import {
  isMaintenanceBlockedError,
  setMaintenanceRoleVerifier,
} from './access';
import { getMaintenanceStatus, setMaintenanceStatus } from './config';
import { refreshMaintenanceStatus } from './status';

const inactive = {
  inProgress: false,
  title: null,
  noticeMessage: null,
  endAt: null,
  imageUrl: null,
};
const active = {
  inProgress: true,
  title: '정기 점검',
  noticeMessage: '잠시 기다려 주세요.',
  endAt: '2026-11-22 19:00:00',
  imageUrl: 'https://example.com/notice.png',
};
const originalAdapter = authAxios.defaults.adapter;

beforeEach(() => {
  localStorage.clear();
  setMaintenanceStatus(inactive);
  setMaintenanceRoleVerifier(jest.fn().mockResolvedValue(2));
});
afterEach(() => {
  authAxios.defaults.adapter = originalAdapter;
});

it('skips unauthenticated lookup', async () => {
  const adapter = jest.fn();
  authAxios.defaults.adapter = adapter;
  await refreshMaintenanceStatus(true);
  expect(adapter).not.toHaveBeenCalled();
});

it('fetches authenticated status during maintenance and restores service on the next inactive response', async () => {
  localStorage.setItem('accessToken', 'status-session');
  setMaintenanceStatus(active);
  const adapter = jest.fn(async (config) => ({
    config,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data: { isSuccess: true, result: active },
  }));
  authAxios.defaults.adapter = adapter;
  await refreshMaintenanceStatus(true);
  expect(adapter.mock.calls[0][0].url).toBe('/v1/server-maintenance/status');
  expect(adapter.mock.calls[0][0].headers.get('Authorization')).toBe(
    'Bearer status-session'
  );
  expect(getMaintenanceStatus()).toEqual(active);
  adapter.mockImplementation(async (config) => ({
    config,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data: { isSuccess: true, result: inactive },
  }));
  await refreshMaintenanceStatus(true);
  expect(getMaintenanceStatus().inProgress).toBe(false);
});

it('deduplicates concurrent lookups and retains status on failure', async () => {
  localStorage.setItem('accessToken', 'failure-session');
  setMaintenanceStatus(active);
  const adapter = jest.fn().mockRejectedValue(new Error('offline'));
  authAxios.defaults.adapter = adapter;
  await Promise.all([
    refreshMaintenanceStatus(true),
    refreshMaintenanceStatus(true),
  ]);
  expect(adapter).toHaveBeenCalledTimes(1);
  expect(getMaintenanceStatus()).toEqual(active);
});

it('ignores a response from a logged-out session', async () => {
  localStorage.setItem('accessToken', 'old-session');
  let resolveResponse;
  let markStarted;
  const started = new Promise<void>((resolve) => {
    markStarted = resolve;
  });
  authAxios.defaults.adapter = (config) =>
    new Promise((resolve) => {
      markStarted();
      resolveResponse = () =>
        resolve({
          config,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          data: { isSuccess: true, result: active },
        });
    });
  const request = refreshMaintenanceStatus(true);
  await started;
  localStorage.removeItem('accessToken');
  resolveResponse();
  await request;
  expect(getMaintenanceStatus().inProgress).toBe(false);
});

it('activates maintenance for server error 503 / 2135 and preserves the recognizable error', async () => {
  const error = await defaultAxios
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
    .catch((failure) => failure);
  expect(isMaintenanceBlockedError(error)).toBe(true);
  expect(getMaintenanceStatus().inProgress).toBe(true);
});
