import { ROLE } from '@/shared/constant/role';

// 추후 어드민 설정 API로 교체할 점검 정책입니다.
export const MAINTENANCE_START = new Date('2026-10-03T14:00:00+09:00');
export const MAINTENANCE_END = new Date('2026-10-03T20:00:00+09:00');
export const MAINTENANCE_ALLOWED_ROLES: readonly number[] = [ROLE.admin];

export function isMaintenanceTime(now = Date.now()) {
  return now >= MAINTENANCE_START.getTime() && now <= MAINTENANCE_END.getTime();
}
