import { Query } from '@tanstack/react-query';
import axios from 'axios';

import { HTTP_STATUS_CODE } from '@/shared/constant';
import { HttpError } from '@/shared/lib/HttpError';
import { NetworkError } from '@/shared/lib/NetworkError';

import { captureException, isHttpError, isNetworkError } from '@/sentry';

export function handleQueryError(error: Error, query: Query) {
  if (isHttpError(error) && error.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
    window.dispatchEvent(new CustomEvent('auth:logout'));
    return;
  }

  if (isCanceledRequest(error)) return;
  if (!shouldReportToSentry(error)) return;

  captureException(error, {
    tags: getQueryErrorTags(error, query),
    extra: getQueryErrorExtra(error, query),
  });
}

function isCanceledRequest(error: unknown): boolean {
  return axios.isCancel(error);
}

export function shouldReportToSentry(error: Error) {
  if (isNetworkError(error)) {
    return error.type !== 'OFFLINE';
  }

  if (
    isHttpError(error) &&
    error.kind === 'API_CONTRACT' &&
    error.status >= 400 &&
    error.status < 500
  ) {
    return false;
  }

  return true;
}

export function getQueryErrorTags(error: Error, query: Query) {
  return {
    operation: 'query',
    error_kind: getErrorKind(error),
    http_status: isHttpError(error) ? String(error.status) : 'none',
    query_key_root: Array.isArray(query.queryKey)
      ? String(query.queryKey[0])
      : String(query.queryKey),
  };
}

function getErrorKind(error: Error) {
  if (error instanceof NetworkError) return 'network';

  if (error instanceof HttpError) {
    return error.kind.toLowerCase();
  }

  return 'unknown';
}

export function getQueryErrorExtra(error: Error, query: Query) {
  return {
    queryKey: query.queryKey,

    errorName: error.name,
    errorMessage: error.message,
    ...getCustomErrorExtra(error),

    pathname: window.location.pathname,
    online: window.navigator.onLine,
  };
}

function getCustomErrorExtra(error: Error) {
  if (isHttpError(error)) {
    return {
      code: error.code ?? null,
      status: error.status,
      kind: error.kind,
    };
  }

  if (isNetworkError(error)) {
    return {
      networkErrorType: error.type,
    };
  }

  return {};
}
