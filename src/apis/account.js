import axios from 'axios';

import { authAxios } from '@/axios';

export const reissueToken = async () => {
  const response = await axios.post(
    '/v1/users/reissueToken',
    {},
    {
      'Content-Type': 'application/json',
      withCredentials: true,
    }
  );

  return response?.data.result;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await authAxios.post('/v1/users/logout', {
    refreshToken,
  });

  return response?.data.result;
};
