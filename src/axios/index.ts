import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

import { activateSession, clearAuthTokens } from '@/feature/auth/libs';
import {
  isMaintenanceBlocked,
  MaintenanceBlockedError,
} from '@/feature/maintenance/access';
import { isMaintenanceTime } from '@/feature/maintenance/config';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const defaultAxios = createAxiosClient();
const authAxios = createAxiosClient({ withCredentials: true });
const refreshClient = createAxiosClient({ withCredentials: true });

authAxios.interceptors.request.use(attachAccessToken, (error) =>
  Promise.reject(error)
);

authAxios.interceptors.response.use(
  (response) => response,
  handlePrivateClientError
);

export function createAxiosClient(config?: AxiosRequestConfig): AxiosInstance {
  const client = axios.create({
    baseURL: process.env.REACT_APP_SERVER_DOMAIN,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
    ...config,
  });
  client.interceptors.request.use((request) => {
    if (!isMaintenanceTime()) return request;
    const requestType = getMaintenanceRequestType(request);
    if (
      requestType === 'login' ||
      (requestType === 'service' && isMaintenanceBlocked())
    ) {
      throw new MaintenanceBlockedError();
    }
    return request;
  });
  return client;
}

function getMaintenanceRequestType(config: InternalAxiosRequestConfig) {
  const requestUrl = new URL(axios.getUri(config), window.location.origin);
  const serverUrl = new URL(
    process.env.REACT_APP_SERVER_DOMAIN || window.location.origin,
    window.location.origin
  );
  if (requestUrl.origin !== serverUrl.origin) return 'service';

  const method = config.method?.toUpperCase();
  if (method === 'POST' && requestUrl.pathname === '/v2/users/login')
    return 'login';
  if (
    (method === 'GET' && requestUrl.pathname === '/v1/users/mypage') ||
    (method === 'POST' && requestUrl.pathname === '/v2/users/reissueToken') ||
    (method === 'POST' && requestUrl.pathname === '/v2/users/logout')
  )
    return 'auth';
  return 'service';
}

export function attachAccessToken(config: InternalAxiosRequestConfig) {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    setAuthorizationHeader(config, accessToken);
  }

  return config;
}

const refreshAccessTokenOnce = createRefreshAccessTokenOnce();

async function handlePrivateClientError(error: unknown) {
  if (!axios.isAxiosError(error) || !error.config) {
    return Promise.reject(error);
  }

  const originalRequest = error.config as RetryableRequestConfig;

  if (error.response?.status !== 401 || originalRequest._retry) {
    return Promise.reject(error);
  }

  const requestToken = getRequestAccessToken(originalRequest);
  const latestToken = localStorage.getItem('accessToken');

  originalRequest._retry = true;

  if (latestToken && requestToken && latestToken !== requestToken) {
    setAuthorizationHeader(originalRequest, latestToken);
    return authAxios(originalRequest);
  }

  try {
    const accessToken = await refreshAccessTokenOnce();

    activateSession(accessToken);
    setAuthorizationHeader(originalRequest, accessToken);

    return authAxios(originalRequest);
  } catch (refreshError) {
    clearAuthTokens();

    return Promise.reject(refreshError);
  }
}

function createRefreshAccessTokenOnce() {
  let refreshPromise: Promise<string> | null = null;

  return function refreshAccessTokenOnce() {
    if (!refreshPromise) {
      refreshPromise = reissueAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  };
}

function setAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  accessToken: string
) {
  config.headers = AxiosHeaders.from(config.headers);
  config.headers.set('Authorization', `Bearer ${accessToken}`);
}

function getRequestAccessToken(config: InternalAxiosRequestConfig) {
  const authorization = AxiosHeaders.from(config.headers).get('Authorization');

  if (typeof authorization !== 'string') {
    return undefined;
  }

  return authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : undefined;
}

export async function reissueAccessToken() {
  const response = await refreshClient.post('/v2/users/reissueToken');

  return response.data.result.accessToken;
}

export { authAxios, defaultAxios, refreshClient };
