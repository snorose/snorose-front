import { isMaintenanceTime, setMaintenanceStatus } from './config';

const schedule = {
  inProgress: true,
  startAt: '2026-11-25 14:00:00',
  endAt: '2026-11-25 19:00:00',
  noticeMessage: '점검 중입니다.',
  imageUrl: null,
};

beforeEach(() => setMaintenanceStatus(schedule));

it('only blocks during the registered Korean time period', () => {
  expect(isMaintenanceTime(Date.parse('2026-11-25T13:59:59+09:00'))).toBe(
    false
  );
  expect(isMaintenanceTime(Date.parse('2026-11-25T14:00:00+09:00'))).toBe(true);
  expect(isMaintenanceTime(Date.parse('2026-11-25T18:59:59+09:00'))).toBe(true);
  expect(isMaintenanceTime(Date.parse('2026-11-25T19:00:00+09:00'))).toBe(
    false
  );
});

it('honors immediate completion before the scheduled end', () => {
  setMaintenanceStatus({ ...schedule, inProgress: false });
  expect(isMaintenanceTime(Date.parse('2026-11-25T15:00:00+09:00'))).toBe(
    false
  );
});

it('uses the server status when its response has no schedule dates', () => {
  setMaintenanceStatus({ ...schedule, startAt: null, endAt: null });
  expect(isMaintenanceTime()).toBe(true);
});

it('handles timestamps with explicit offsets without adding another timezone', () => {
  setMaintenanceStatus({
    ...schedule,
    startAt: '2026-11-25T05:00:00Z',
    endAt: '2026-11-25T10:00:00Z',
  });
  expect(isMaintenanceTime(Date.parse('2026-11-25T14:00:00+09:00'))).toBe(true);
  expect(isMaintenanceTime(Date.parse('2026-11-25T19:00:00+09:00'))).toBe(
    false
  );
});
