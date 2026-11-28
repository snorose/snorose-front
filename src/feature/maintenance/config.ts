import { createStore } from 'zustand/vanilla';

import { ROLE } from '@/shared/constant/role';

export type MaintenanceStatus = {
  inProgress: boolean;
  startAt?: string | null;
  endAt: string | null;
  noticeMessage: string | null;
  imageUrl: string | null;
  title?: string | null;
};

const store = createStore<MaintenanceStatus>(() => ({
  inProgress: false,
  startAt: null,
  endAt: null,
  noticeMessage: null,
  imageUrl: null,
}));

export const getMaintenanceStatus = store.getState;
export const subscribeMaintenanceStatus = store.subscribe;
export const MAINTENANCE_ALLOWED_ROLES: readonly number[] = [ROLE.admin];

export function setMaintenanceStatus(status: MaintenanceStatus) {
  store.setState(status, true);
}

// 서버의 시간대 없는 점검 일시는 한국 시각입니다.
function parseMaintenanceTime(value: string | null | undefined) {
  if (!value) return undefined;
  const normalized = value.replace(' ', 'T');
  const time = Date.parse(
    /(?:Z|[+-]\d{2}:\d{2})$/.test(normalized)
      ? normalized
      : `${normalized}+09:00`
  );
  return Number.isFinite(time) ? time : undefined;
}

export function isMaintenanceTime(now = Date.now()) {
  const { inProgress, startAt, endAt } = getMaintenanceStatus();
  const start = parseMaintenanceTime(startAt);
  const end = parseMaintenanceTime(endAt);
  return (
    inProgress &&
    (start === undefined || now >= start) &&
    (end === undefined || now < end)
  );
}
