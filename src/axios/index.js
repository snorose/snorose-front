import axios from 'axios';

import { reissueToken } from '@/apis';

const defaultAxios = axios.create({
  baseURL: process.env.REACT_APP_SERVER_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authAxios = axios.create({
  baseURL: process.env.REACT_APP_SERVER_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
    withCredentials: true,
  },
});

authAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken') ?? 'unauthorized';

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 토큰 재발급
    if (error.response.status === 401 && !originalRequest._retry) {
      try {
        const { accessToken } = await reissueToken();
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest._retry = true;

        return authAxios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { authAxios, defaultAxios };
