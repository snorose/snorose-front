import { createStore } from 'zustand/vanilla';

import { isMaintenanceTime } from './config';

type Access = 'inactive' | 'blocked';

const accessStore = createStore<Access>(() => 'inactive');
// 기존 Zustand를 재사용하되 Axios에서도 React 없이 읽을 수 있는 store로 만듭니다.
export const getMaintenanceAccess = accessStore.getState;
export const subscribeMaintenanceAccess = accessStore.subscribe;

// 현재 시간을 동기적으로 검사하므로 화면의 타이머가 늦어져도 요청을 차단합니다.
export function syncMaintenanceAccess() {
  const next: Access = isMaintenanceTime() ? 'blocked' : 'inactive';
  accessStore.setState(next, true);
  return next;
}

export function isMaintenanceBlocked() {
  return syncMaintenanceAccess() === 'blocked';
}

export class MaintenanceBlockedError extends Error {
  readonly code = 'MAINTENANCE_BLOCKED';
  // 기존 response.data를 참조하는 직접 요청 처리도 안전하게 종료합니다.
  readonly response = {
    status: 503,
    data: { code: 'MAINTENANCE_BLOCKED', message: '서버 점검 중입니다.' },
  };

  constructor() {
    super('서버 점검 중입니다.');
    this.name = 'MaintenanceBlockedError';
  }
}

export function isMaintenanceBlockedError(error: unknown) {
  return error instanceof MaintenanceBlockedError;
}
