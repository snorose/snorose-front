import axios, { AxiosError } from 'axios';

import { HttpError } from '@/shared/lib/HttpError';
import { NetworkError } from '@/shared/lib/NetworkError';

type ApiResponseBase = {
  code: number;
  message: string;
};

export function throwNormalizedError(error: unknown): never {
  if (axios.isCancel(error)) {
    throw error;
  }

  if (!axios.isAxiosError(error)) {
    throw error;
  }

  const axiosError = error as AxiosError<unknown>;
  const response = axiosError.response;

  if (!response) {
    throwNetworkError(axiosError);
  }

  const { status, data } = response;

  if (isApiResponseBase(data)) {
    throw new HttpError(data.message, {
      status,
      kind: 'API_RESPONSE',
      code: data.code,
      cause: axiosError,
    });
  }

  throw new HttpError(axiosError.message || '알 수 없는 오류가 발생했습니다.', {
    status,
    kind: 'UNEXPECTED_RESPONSE',
    cause: axiosError,
  });
}

function throwNetworkError(error: AxiosError<unknown>): never {
  if (!window.navigator.onLine) {
    throw new NetworkError(
      '인터넷 연결이 끊겼습니다. 네트워크 상태를 확인해 주세요.',
      { type: 'OFFLINE', cause: error }
    );
  }

  if (error.code === 'ECONNABORTED') {
    throw new NetworkError('요청 시간이 초과되었습니다. 다시 시도해 주세요.', {
      type: 'TIMEOUT',
      cause: error,
    });
  }

  if (error.code === 'ERR_NETWORK') {
    throw new NetworkError(
      '서버와 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
      { type: 'CONNECTION_ERROR', cause: error }
    );
  }

  throw new NetworkError(
    '서버와 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    { type: 'UNKNOWN', cause: error }
  );
}

function isApiResponseBase(data: unknown): data is ApiResponseBase {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as Partial<ApiResponseBase>).code === 'number' &&
    typeof (data as Partial<ApiResponseBase>).message === 'string'
  );
}
