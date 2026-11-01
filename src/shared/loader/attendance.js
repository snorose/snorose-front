import { json } from 'react-router-dom';

import { isMaintenanceBlockedError } from '@/feature/maintenance/access';

import { isAttendanceCheckedToday } from '@/apis';

export const attendanceLoader = async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return null;
  }

  try {
    const attendance = await isAttendanceCheckedToday();

    return json({ attendance });
  } catch (error) {
    if (isMaintenanceBlockedError(error)) throw error;
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    return null;
  }
};
