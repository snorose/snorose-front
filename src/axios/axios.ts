import axios, { AxiosError } from 'axios';

import {
  ApiErrorStatusCode,
  INFRA_ERROR_STATUS_CODE,
  InfraErrorStatusCode,
} from '@/shared/constant';
import { ApiError } from '@/shared/lib/ApiError';
import { InfraError } from '@/shared/lib/InfraError';
import { NetworkError } from '@/shared/lib/NetworkError';

const publicClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

const privateClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

interface BaseResponse<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  result?: T;
}

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

privateClient.interceptors.response.use(
  (response) => response,
  throwNormalizedError
);

function throwNormalizedError(error: unknown): never {
  if (axios.isCancel(error)) throw error;

  if (!axios.isAxiosError(error)) throw error;

  const axiosError = error as AxiosError<BaseResponse>;

  if (!axiosError.response) {
    return handleNetworkError(axiosError);
  }

  const { headers, status, data } = axiosError.response;

  const contentType = headers['content-type'] ?? headers['Content-Type'];
  const isJsonResponse =
    typeof contentType === 'string' && contentType.includes('application/json');
  const errorMessage =
    data?.message ||
    axiosError.message ||
    '알 수 없는 서버 에러가 발생했습니다.';
  const errorCode = typeof data?.code === 'number' ? data.code : 0;

  if (
    (INFRA_ERROR_STATUS_CODE as readonly number[]).includes(status) ||
    !isJsonResponse
  ) {
    throw new InfraError(errorMessage, {
      errorStatusCode: status as InfraErrorStatusCode,
    });
  }

  throw new ApiError(errorMessage, {
    code: errorCode,
    errorStatusCode: status as ApiErrorStatusCode,
  });
}

function handleNetworkError(error: AxiosError<BaseResponse>): never {
  if (!window.navigator.onLine) {
    throw new NetworkError(
      '인터넷 연결이 끊겼습니다. 네트워크 상태를 확인해 주세요.',
      { type: 'OFFLINE' }
    );
  }

  if (error.code === 'ECONNABORTED') {
    throw new NetworkError('요청 시간이 초과되었습니다. 다시 시도해 주세요.', {
      type: 'TIMEOUT',
    });
  }

  if (error.code === 'ERR_NETWORK') {
    throw new NetworkError(
      '서버와 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
      { type: 'CONNECTION_ERROR' }
    );
  }

  throw error;
}

export { privateClient, publicClient };
