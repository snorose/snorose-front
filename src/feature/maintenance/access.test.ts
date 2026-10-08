import {
  getMaintenanceAccess,
  invalidateMaintenanceSession,
  isMaintenanceBlocked,
  refreshMaintenanceAccess,
  setMaintenanceRoleVerifier,
} from './access';
import {
  isMaintenanceTime,
  MAINTENANCE_END,
  MAINTENANCE_START,
} from './config';

describe('maintenance access', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MAINTENANCE_START);
    localStorage.clear();
    invalidateMaintenanceSession();
  });
  afterEach(() => jest.useRealTimers());

  it('includes both boundaries and allows requests outside the period', () => {
    expect(isMaintenanceTime(MAINTENANCE_START.getTime() - 1)).toBe(false);
    expect(isMaintenanceTime(MAINTENANCE_START.getTime())).toBe(true);
    expect(isMaintenanceTime(MAINTENANCE_END.getTime())).toBe(true);
    jest.setSystemTime(MAINTENANCE_END.getTime() + 1);
    expect(isMaintenanceBlocked()).toBe(false);
  });

  it('does not verify roles outside maintenance', async () => {
    jest.setSystemTime(MAINTENANCE_START.getTime() - 1);
    localStorage.setItem('accessToken', 'session');
    const verifier = jest.fn().mockResolvedValue(4);
    setMaintenanceRoleVerifier(verifier);
    await refreshMaintenanceAccess(true);
    expect(verifier).not.toHaveBeenCalled();
    expect(getMaintenanceAccess()).toBe('inactive');
  });

  it('blocks anonymous users without calling the verifier', async () => {
    const verifier = jest.fn().mockResolvedValue(4);
    setMaintenanceRoleVerifier(verifier);
    await refreshMaintenanceAccess();
    expect(isMaintenanceBlocked()).toBe(true);
    expect(verifier).not.toHaveBeenCalled();
  });

  it.each([1, 2, 3, 5, 6, 7, undefined])('blocks role %s', async (role) => {
    localStorage.setItem('accessToken', 'session');
    setMaintenanceRoleVerifier(jest.fn().mockResolvedValue(role));
    await refreshMaintenanceAccess();
    expect(getMaintenanceAccess()).toBe('blocked');
  });

  it('allows only a verified admin and deduplicates concurrent checks', async () => {
    localStorage.setItem('accessToken', 'session');
    const verifier = jest.fn().mockResolvedValue(4);
    setMaintenanceRoleVerifier(verifier);
    const request = refreshMaintenanceAccess();
    expect(isMaintenanceBlocked()).toBe(true);
    await Promise.all([request, refreshMaintenanceAccess(true)]);
    expect(verifier).toHaveBeenCalledTimes(1);
    expect(isMaintenanceBlocked()).toBe(false);
    expect(getMaintenanceAccess()).toBe('allowed');
  });

  it('blocks verification failures and retries on explicit recheck', async () => {
    localStorage.setItem('accessToken', 'session');
    const verifier = jest
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue(4);
    setMaintenanceRoleVerifier(verifier);
    await refreshMaintenanceAccess();
    expect(getMaintenanceAccess()).toBe('blocked');
    await refreshMaintenanceAccess();
    expect(verifier).toHaveBeenCalledTimes(1);
    await refreshMaintenanceAccess(true);
    expect(getMaintenanceAccess()).toBe('allowed');
  });

  it('rejects an old verification result after logout', async () => {
    localStorage.setItem('accessToken', 'session');
    let resolveRole: (role: number) => void;
    setMaintenanceRoleVerifier(
      () =>
        new Promise((resolve) => {
          resolveRole = resolve;
        })
    );
    const request = refreshMaintenanceAccess();
    await Promise.resolve();
    localStorage.removeItem('accessToken');
    invalidateMaintenanceSession();
    resolveRole!(4);
    await request;
    expect(getMaintenanceAccess()).toBe('blocked');
  });

  it('requires re-verification when the token changes', async () => {
    localStorage.setItem('accessToken', 'old-session');
    setMaintenanceRoleVerifier(jest.fn().mockResolvedValue(4));
    await refreshMaintenanceAccess();
    localStorage.setItem('accessToken', 'new-session');
    expect(isMaintenanceBlocked()).toBe(true);
    expect(getMaintenanceAccess()).toBe('checking');
  });

  it('does not restore admin access after maintenance ends', async () => {
    localStorage.setItem('accessToken', 'session');
    let resolveRole: (role: number) => void;
    setMaintenanceRoleVerifier(
      () =>
        new Promise((resolve) => {
          resolveRole = resolve;
        })
    );
    const request = refreshMaintenanceAccess();
    await Promise.resolve();
    jest.setSystemTime(MAINTENANCE_END.getTime() + 1);
    resolveRole!(4);
    await request;
    expect(getMaintenanceAccess()).toBe('inactive');
  });
});
