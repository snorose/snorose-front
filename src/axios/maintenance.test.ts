import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

import {
  MaintenanceBlockedError,
  syncMaintenanceAccess,
} from '@/feature/maintenance/access';
import {
  MAINTENANCE_END,
  MAINTENANCE_START,
} from '@/feature/maintenance/config';

import {
  authAxios,
  createAxiosClient,
  defaultAxios,
  refreshClient,
} from './index';

function response(config: InternalAxiosRequestConfig) {
  return {
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config,
    data: { result: {} },
  };
}

describe('maintenance request guard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MAINTENANCE_START);
    localStorage.clear();
    syncMaintenanceAccess();
  });
  afterEach(() => jest.useRealTimers());

  it.each(['get', 'post', 'patch', 'delete', 'put'])(
    'blocks %s before reaching the adapter',
    async (method) => {
      const adapter = jest.fn();
      await expect(
        createAxiosClient({ adapter }).request({
          method,
          url: '/v1/boards/1/posts/newpost',
        })
      ).rejects.toBeInstanceOf(MaintenanceBlockedError);
      expect(adapter).not.toHaveBeenCalled();
    }
  );

  it.each([authAxios, defaultAxios, refreshClient])(
    'guards every shared client',
    async (client) => {
      const adapter = jest.fn();
      await expect(
        client.get('/v1/home/banners/view', { adapter })
      ).rejects.toBeInstanceOf(MaintenanceBlockedError);
      expect(adapter).not.toHaveBeenCalled();
    }
  );

  it.each([
    ['get', '/v1/users/mypage'],
    ['post', '/v2/users/login'],
    ['post', '/v2/users/reissueToken'],
    ['post', '/v2/users/logout'],
    ['get', 'https://external.example/v1/users/mypage'],
    ['put', 'https://bucket.example/file'],
  ])('does not allow exceptions for %s %s', async (method, url) => {
    const adapter = jest.fn();
    await expect(
      createAxiosClient({ adapter }).request({ method, url })
    ).rejects.toBeInstanceOf(MaintenanceBlockedError);
    expect(adapter).not.toHaveBeenCalled();
  });

  it.each(['regular-session', 'admin-session'])(
    'also blocks existing logged-in sessions: %s',
    async (token) => {
      localStorage.setItem('accessToken', token);
      const adapter = jest.fn();
      await expect(
        createAxiosClient({ adapter }).post('/v1/boards/1/posts/newpost')
      ).rejects.toBeInstanceOf(MaintenanceBlockedError);
      expect(adapter).not.toHaveBeenCalled();
    }
  );

  it.each([MAINTENANCE_START.getTime() - 1, MAINTENANCE_END.getTime() + 1])(
    'allows normal requests outside maintenance: %s',
    async (time) => {
      jest.setSystemTime(time);
      const adapter = jest.fn(async (config) => response(config));
      await createAxiosClient({ adapter }).post('/v2/users/login');
      expect(adapter).toHaveBeenCalledTimes(1);
    }
  );

  it('blocks a submission at the deadline before the screen timer runs', async () => {
    jest.setSystemTime(MAINTENANCE_START.getTime() - 1);
    syncMaintenanceAccess();
    const adapter = jest.fn();
    const client = createAxiosClient({ adapter });
    jest.setSystemTime(MAINTENANCE_START);
    await expect(
      client.post('/v1/boards/1/posts/newpost')
    ).rejects.toBeInstanceOf(MaintenanceBlockedError);
    expect(adapter).not.toHaveBeenCalled();
  });
});
