import { authAxios } from '@/axios';

import { MaintenanceStatus, setMaintenanceStatus } from './config';

let pending: Promise<void> | null = null;
let lastToken: string | null = null;
let lastChecked = 0;

export function refreshMaintenanceStatus(force = false): Promise<void> {
  const token = localStorage.getItem('accessToken');
  // 명세상 인증이 필수이므로 비로그인 상태에서는 조회하지 않습니다.
  if (!token) {
    lastToken = null;
    lastChecked = 0;
    return Promise.resolve();
  }
  if (pending) return pending;
  if (!force && token === lastToken && Date.now() - lastChecked < 30000) {
    return Promise.resolve();
  }
  lastToken = token;
  lastChecked = Date.now();
  pending = authAxios
    .get('/v1/server-maintenance/status')
    .then(({ data }) => {
      if (localStorage.getItem('accessToken') !== token) return;
      if (!data.isSuccess || typeof data.result?.inProgress !== 'boolean') {
        throw new Error('Invalid maintenance status response');
      }
      const result: MaintenanceStatus = data.result;
      setMaintenanceStatus(result);
    })
    // 일시적인 조회 실패로 점검을 해제하지 않고 다음 조회에서 재시도합니다.
    .catch(() => {})
    .finally(() => {
      pending = null;
    });
  return pending;
}
