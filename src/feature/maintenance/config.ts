import { createStore } from 'zustand/vanilla';

import { ROLE } from '@/shared/constant/role';

export type MaintenanceStatus = {
  inProgress: boolean;
  title: string | null;
  noticeMessage: string | null;
  endAt: string | null;
  imageUrl: string | null;
};

const store = createStore<MaintenanceStatus>(() => ({
  inProgress: false,
  title: null,
  noticeMessage: null,
  endAt: null,
  imageUrl: null,
}));

export const getMaintenanceStatus = store.getState;
export const subscribeMaintenanceStatus = store.subscribe;
export const MAINTENANCE_ALLOWED_ROLES: readonly number[] = [ROLE.admin];

export function setMaintenanceStatus(status: MaintenanceStatus) {
  store.setState(status, true);
}

// 종료 예정 시각이 지나도 서버가 종료를 알릴 때까지 점검을 유지합니다.
export function isMaintenanceTime() {
  return getMaintenanceStatus().inProgress;
}
