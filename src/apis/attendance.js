import { authAxios } from '@/axios';

export const isAttendanceCheckedToday = async () => {
  const response = await authAxios.get('/v1/points/attendance/today');
  return response?.data.result.isAttendedToday;
};

export const updatePoint = async ({
  encryptedUserId,
  category,
  source,
  sourceId,
  difference,
}) => {
  const response = await authAxios.post('/v1/points', {
    encryptedUserId,
    category,
    source,
    ...(sourceId && { sourceId }),
    ...(difference && { difference }),
  });
  return response;
};

export const getMonthlyAttendanceHistory = async ({ year, month }) => {
  const response = await authAxios.get('/v1/points/attendance', {
    params: { year, month },
  });
  return response?.data.result;
};
