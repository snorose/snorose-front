import { authAxios, defaultAxios } from '@/axios';

import { MaintenanceStatus, setMaintenanceStatus } from './config';

const pending = new Map<string | null, Promise<void>>();
let lastToken: string | null | undefined;
let lastChecked = 0;

export function refreshMaintenanceStatus(force = false): Promise<void> {
  const token = localStorage.getItem('accessToken');
  const current = pending.get(token);
  if (current) return current;
  if (!force && token === lastToken && Date.now() - lastChecked < 30000) {
    return Promise.resolve();
  }
  lastToken = token;
  lastChecked = Date.now();
  // 비로그인 사용자도 점검 종료를 확인할 수 있어야 합니다.
  const client = token ? authAxios : defaultAxios;
  const request = client
    .get('/v1/server-maintenance/status')
    .then(({ data }) => {
      if (localStorage.getItem('accessToken') !== token) return;
      if (!data.isSuccess || typeof data.result?.inProgress !== 'boolean') {
        throw new Error('Invalid maintenance status response');
      }
      const result: MaintenanceStatus = data.result;
      setMaintenanceStatus(result);
    })
    // 통신 실패만으로 점검을 시작하거나 종료하지 않습니다.
    .catch(() => {})
    .finally(() => {
      pending.delete(token);
    });
  pending.set(token, request);
  return request;
}
