import { json } from 'react-router-dom';

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
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    return null;
  }
};
