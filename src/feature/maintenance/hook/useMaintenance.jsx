import { DateTime } from '@/shared/lib';

export const MAINTENANCE_START = new Date('2025-07-18T08:00:00+09:00'); // 서버 점검 시작(년-월-일THH:MM:SS+한국기준)
export const MAINTENANCE_END = new Date('2025-07-18T16:00:00+09:00'); // 서버 점검 끝

export function useMaintenance(MAINTENANCE_START, MAINTENANCE_END) {
  const isSameDate =
    MAINTENANCE_START.toDateString() === MAINTENANCE_END.toDateString();

  const startDateStr = DateTime.format(MAINTENANCE_START, 'YMD_D');
  const endDateStr = DateTime.format(MAINTENANCE_END, 'YMD_D');
  const startTime = DateTime.format(MAINTENANCE_START, 'HM');
  const endTime = DateTime.format(MAINTENANCE_END, 'HM');

  // YYYY/MM/DD (Day) HH:MM ~ HH:MM
  return isSameDate
    ? `${startDateStr} ${startTime} - ${endTime}`
    : [`${startDateStr} ${startTime}`, <br />, `- ${endDateStr} ${endTime}`];
}
