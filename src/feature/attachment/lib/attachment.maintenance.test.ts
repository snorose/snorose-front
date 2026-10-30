import {
  MaintenanceBlockedError,
  syncMaintenanceAccess,
} from '@/feature/maintenance/access';
import { MAINTENANCE_START } from '@/feature/maintenance/config';

import { downloadFromS3 } from './attachment';

jest.mock('@/shared/constant', () => ({}));
jest.mock('file-saver', () => ({ saveAs: jest.fn() }));

describe('maintenance guard for attachment fetch', () => {
  const originalFetch = global.fetch;
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MAINTENANCE_START);
    localStorage.clear();
    syncMaintenanceAccess();
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });
  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });

  it('blocks a new download before calling fetch', async () => {
    await expect(
      downloadFromS3('https://bucket.example/file')
    ).rejects.toBeInstanceOf(MaintenanceBlockedError);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('also blocks downloads for existing admin sessions', async () => {
    localStorage.setItem('accessToken', 'admin');
    await expect(
      downloadFromS3('https://bucket.example/file')
    ).rejects.toBeInstanceOf(MaintenanceBlockedError);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('does not change downloads outside maintenance', async () => {
    jest.setSystemTime(MAINTENANCE_START.getTime() - 1);
    await downloadFromS3('https://bucket.example/file');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
