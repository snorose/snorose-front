import { MaintenanceBlockedError } from '@/feature/maintenance/access';
import { readInquiry, readReport } from '@/feature/support/api';
import { inquiryEditLoader, reportEditLoader } from '@/feature/support/loader';

import { isAttendanceCheckedToday } from '@/apis';

import { attendanceLoader } from './attendance';

jest.mock('@/apis', () => ({ isAttendanceCheckedToday: jest.fn() }));
jest.mock('@/feature/support/api', () => ({
  readInquiry: jest.fn(),
  readReport: jest.fn(),
}));

describe('route loader recovery from maintenance', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('accessToken', 'existing-session');
    jest.clearAllMocks();
  });

  it.each([
    ['attendance', attendanceLoader, isAttendanceCheckedToday],
    ['inquiry edit', inquiryEditLoader, readInquiry],
    ['report edit', reportEditLoader, readReport],
  ])(
    'preserves %s maintenance failures for router recovery',
    async (_, loader, request) => {
      const error = new MaintenanceBlockedError();
      request.mockRejectedValueOnce(error);
      await expect(loader({ params: { postId: '123' } })).rejects.toBe(error);
      expect(localStorage.getItem('accessToken')).toBe('existing-session');
    }
  );

  it('keeps the existing attendance session-expiry handling', async () => {
    isAttendanceCheckedToday.mockRejectedValueOnce({
      response: { status: 401 },
    });
    await expect(attendanceLoader()).resolves.toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});
