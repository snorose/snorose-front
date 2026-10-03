import { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

import { getMyPageUserInfo } from '@/apis/userInfo';

import {
  invalidateMaintenanceSession,
  MaintenanceBlockedError,
  refreshMaintenanceAccess,
  setMaintenanceRoleVerifier,
} from '@/feature/maintenance/access';
import { MAINTENANCE_START } from '@/feature/maintenance/config';

import {
  authAxios,
  createAxiosClient,
  defaultAxios,
  refreshClient,
} from './index';

function response(config: InternalAxiosRequestConfig, result = {}) {
  return {
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config,
    data: { result },
  };
}

describe('maintenance request guard', () => {
  const originalAuthAdapter = authAxios.defaults.adapter;
  const originalRefreshAdapter = refreshClient.defaults.adapter;
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MAINTENANCE_START);
    localStorage.clear();
    invalidateMaintenanceSession();
    setMaintenanceRoleVerifier(
      async () => (await getMyPageUserInfo()).userRoleId
    );
  });
  afterEach(() => {
    jest.restoreAllMocks();
    authAxios.defaults.adapter = originalAuthAdapter;
    refreshClient.defaults.adapter = originalRefreshAdapter;
    jest.useRealTimers();
  });

  it.each(['get', 'post', 'patch', 'delete', 'put'])(
    'blocks %s before reaching the adapter',
    async (method) => {
      const adapter = jest.fn();
      const client = createAxiosClient({ adapter });
      await expect(
        client.request({ method, url: '/v1/boards/1/posts/newpost' })
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
    ['post', '/v2/users/reissueToken'],
    ['post', '/v2/users/logout'],
  ])(
    'allows only required authentication request %s %s',
    async (method, url) => {
      const adapter = jest.fn(async (config) => response(config));
      await createAxiosClient({ adapter }).request({ method, url });
      expect(adapter).toHaveBeenCalledTimes(1);
    }
  );

  it.each([
    ['post', '/v2/users/login'],
    ['post', '/v1/users/mypage'],
    ['get', '/v1/users/mypage/extra'],
    ['get', 'https://external.example/v1/users/mypage'],
    ['put', 'https://bucket.example/file'],
  ])('does not extend the auth exceptions to %s %s', async (method, url) => {
    const adapter = jest.fn();
    await expect(
      createAxiosClient({ adapter }).request({ method, url })
    ).rejects.toBeInstanceOf(MaintenanceBlockedError);
    expect(adapter).not.toHaveBeenCalled();
  });

  it('allows a verified admin and revokes access on logout', async () => {
    localStorage.setItem('accessToken', 'admin-token');
    jest
      .spyOn(authAxios, 'get')
      .mockResolvedValue({ data: { result: { userRoleId: 4 } } });
    await refreshMaintenanceAccess();
    const adapter = jest.fn(async (config) => response(config));
    const client = createAxiosClient({ adapter });
    await client.post('/v1/boards/1/posts/newpost');
    expect(adapter).toHaveBeenCalledTimes(1);
    await expect(client.post('/v2/users/login')).rejects.toBeInstanceOf(
      MaintenanceBlockedError
    );
    expect(adapter).toHaveBeenCalledTimes(1);
    localStorage.removeItem('accessToken');
    await expect(
      client.post('/v1/boards/1/posts/newpost')
    ).rejects.toBeInstanceOf(MaintenanceBlockedError);
    expect(adapter).toHaveBeenCalledTimes(1);
  });

  it('continues normal requests outside maintenance', async () => {
    jest.setSystemTime(MAINTENANCE_START.getTime() - 1);
    const adapter = jest.fn(async (config) => response(config));
    await createAxiosClient({ adapter }).post('/v2/users/login');
    expect(adapter).toHaveBeenCalledTimes(1);
  });

  it('refreshes an expired existing session while checking the admin role', async () => {
    localStorage.setItem('accessToken', 'expired-token');
    authAxios.defaults.adapter = jest.fn(async (config) => {
      if (
        AxiosHeaders.from(config.headers).get('Authorization') ===
        'Bearer expired-token'
      ) {
        throw new AxiosError('expired', undefined, config, undefined, {
          ...response(config),
          status: 401,
        });
      }
      return response(config, { userRoleId: 4 });
    });
    refreshClient.defaults.adapter = jest.fn(async (config) =>
      response(config, { accessToken: 'renewed-token' })
    );
    await refreshMaintenanceAccess();
    // 토큰 변경으로 이전 확인 결과를 버린 뒤 새 세션으로 재검증합니다.
    await refreshMaintenanceAccess();
    expect(localStorage.getItem('accessToken')).toBe('renewed-token');
    const adapter = jest.fn(async (config) => response(config));
    await createAxiosClient({ adapter }).post('/v1/boards/1/posts/newpost');
    expect(adapter).toHaveBeenCalledTimes(1);
  });
});
