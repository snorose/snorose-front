import { authAxios } from '@/axios';

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await authAxios.post('/v1/users/logout', {
    refreshToken,
  });

  return response?.data.result;
};
