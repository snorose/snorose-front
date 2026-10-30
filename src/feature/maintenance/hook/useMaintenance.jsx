import { DateTime } from '@/shared/lib';

export { MAINTENANCE_END, MAINTENANCE_START } from '../config';

export function useMaintenance(MAINTENANCE_START, MAINTENANCE_END) {
  const isSameDate =
    MAINTENANCE_START.toDateString() === MAINTENANCE_END.toDateString();

  const startDateStr = DateTime.format(MAINTENANCE_START, 'YMD_D');
  const endDateStr = DateTime.format(MAINTENANCE_END, 'YMD_D');
  const startTime = DateTime.format(MAINTENANCE_START, 'HM');
  const endTime = DateTime.format(MAINTENANCE_END, 'HM');

  // YYYY/MM/DD (Day) HH:MM ~ HH:MM
  return isSameDate
    ? `${startDateStr} ${startTime} ~ ${endTime}`
    : [`${startDateStr} ${startTime}`, <br />, `~ ${endDateStr} ${endTime}`];
}
