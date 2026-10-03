// 화면과 요청 차단에서 같은 점검 일정을 사용합니다.
export const MAINTENANCE_START = new Date('2026-10-03T14:00:00+09:00');
export const MAINTENANCE_END = new Date('2026-10-03T20:00:00+09:00');

export function isMaintenanceTime(now = Date.now()) {
  return now >= MAINTENANCE_START.getTime() && now <= MAINTENANCE_END.getTime();
}
