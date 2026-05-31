import axios from 'axios';

import { throwNormalizedError } from '@/axios/normalizeError';

const publicClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const privateClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

privateClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

publicClient.interceptors.response.use(
  (response) => response,
  throwNormalizedError
);

privateClient.interceptors.response.use(
  (response) => response,
  throwNormalizedError
);

export { privateClient, publicClient };
