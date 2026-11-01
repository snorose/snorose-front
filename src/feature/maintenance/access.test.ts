import {
  getMaintenanceAccess,
  isMaintenanceBlocked,
  syncMaintenanceAccess,
} from './access';
import {
  isMaintenanceTime,
  MAINTENANCE_END,
  MAINTENANCE_START,
} from './config';

describe('maintenance access', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MAINTENANCE_START.getTime() - 1);
    localStorage.clear();
    syncMaintenanceAccess();
  });
  afterEach(() => jest.useRealTimers());

  it('includes both boundaries of the maintenance period', () => {
    expect(isMaintenanceTime(MAINTENANCE_START.getTime() - 1)).toBe(false);
    expect(isMaintenanceTime(MAINTENANCE_START.getTime())).toBe(true);
    expect(isMaintenanceTime(MAINTENANCE_END.getTime())).toBe(true);
    expect(isMaintenanceTime(MAINTENANCE_END.getTime() + 1)).toBe(false);
  });

  it.each([null, 'regular-session', 'admin-session'])(
    'blocks every session during maintenance: %s',
    (token) => {
      if (token) localStorage.setItem('accessToken', token);
      jest.setSystemTime(MAINTENANCE_START);
      expect(isMaintenanceBlocked()).toBe(true);
      expect(getMaintenanceAccess()).toBe('blocked');
    }
  );

  it('blocks at the deadline before the screen timer has run', () => {
    expect(isMaintenanceBlocked()).toBe(false);
    jest.setSystemTime(MAINTENANCE_START);
    expect(isMaintenanceBlocked()).toBe(true);
  });

  it('restores normal access after the maintenance period', () => {
    jest.setSystemTime(MAINTENANCE_START);
    syncMaintenanceAccess();
    jest.setSystemTime(MAINTENANCE_END.getTime() + 1);
    expect(isMaintenanceBlocked()).toBe(false);
    expect(getMaintenanceAccess()).toBe('inactive');
  });
});
