import { createStore } from 'zustand/vanilla';

import { isMaintenanceTime, MAINTENANCE_ALLOWED_ROLES } from './config';

type Access = 'inactive' | 'checking' | 'allowed' | 'blocked';
type VerifyRole = () => Promise<number>;

const accessStore = createStore<Access>(() => 'inactive');
let sessionToken: string | null = null;
let revision = 0;
let attempted = false;
let pending: Promise<void> | null = null;
let verifyRole: VerifyRole | undefined;
// 기존 Zustand를 재사용하되 Axios에서도 React 없이 읽을 수 있는 store로 만듭니다.
export const getMaintenanceAccess = accessStore.getState;
export const subscribeMaintenanceAccess = accessStore.subscribe;

function publish(next: Access) {
  accessStore.setState(next, true);
}

export function setMaintenanceRoleVerifier(verifier: VerifyRole) {
  verifyRole = verifier;
}

export function invalidateMaintenanceSession() {
  revision += 1;
  pending = null;
  attempted = false;
  sessionToken = localStorage.getItem('accessToken');
  publish(
    isMaintenanceTime() ? (sessionToken ? 'checking' : 'blocked') : 'inactive'
  );
}

// 시간·토큰을 동기적으로 검사하므로 화면의 타이머가 늦어져도 요청을 차단합니다.
export function syncMaintenanceAccess() {
  const token = localStorage.getItem('accessToken');
  const active = isMaintenanceTime();
  const access = getMaintenanceAccess();
  if (token !== sessionToken || (!active && access !== 'inactive')) {
    invalidateMaintenanceSession();
  }
  if (!active) return 'inactive' as const;
  if (access === 'inactive') invalidateMaintenanceSession();
  return getMaintenanceAccess();
}

export function refreshMaintenanceAccess(force = false): Promise<void> {
  const access = syncMaintenanceAccess();
  if (access === 'inactive' || !sessionToken || !verifyRole) {
    return Promise.resolve();
  }
  if (pending) return pending;
  if (attempted && !force) return Promise.resolve();

  attempted = true;
  const requestRevision = revision;
  publish('checking');
  pending = Promise.resolve()
    .then(() => verifyRole!())
    .then((role) => {
      syncMaintenanceAccess();
      if (requestRevision !== revision || !isMaintenanceTime()) return;
      publish(MAINTENANCE_ALLOWED_ROLES.includes(role) ? 'allowed' : 'blocked');
    })
    .catch(() => {
      syncMaintenanceAccess();
      if (requestRevision === revision && isMaintenanceTime())
        publish('blocked');
    })
    .finally(() => {
      if (requestRevision === revision) pending = null;
    });
  return pending;
}

export function isMaintenanceBlocked() {
  const current = syncMaintenanceAccess();
  return current === 'checking' || current === 'blocked';
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
