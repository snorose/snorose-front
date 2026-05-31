import axios from 'axios';

import { HttpError } from '@/shared/lib/HttpError';
import { NetworkError } from '@/shared/lib/NetworkError';

export function isHttpError(error: Error): error is HttpError {
  return error instanceof HttpError;
}

export function isNetworkError(error: Error): error is NetworkError {
  return error instanceof NetworkError;
}

export function isCanceledRequestError(error: unknown): boolean {
  return axios.isCancel(error);
}
