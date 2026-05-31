import * as Sentry from '@sentry/react';
import axios from 'axios';

import { HttpError } from '@/shared/lib/HttpError';
import { NetworkError } from '@/shared/lib/NetworkError';

export function initSentry() {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_ENV,
    enabled: process.env.REACT_APP_ENV === 'production',
    debug: process.env.NODE_ENV === 'development',
    integrations: [
      Sentry.captureConsoleIntegration({ levels: ['error'] }),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    replaysOnErrorSampleRate: 1.0, // 에러 발생 시 세션 리플레이 100%
    replaysSessionSampleRate: 0.05, // 전체 세션 중 5%만 리플레이
    beforeSend: (event, hint) => {
      if (isCanceledRequestError(hint.originalException)) {
        return null;
      }

      return event;
    },
  });
}

export function captureException(
  error: Error,
  context: Parameters<typeof Sentry.captureException>[1]
) {
  Sentry.captureException(error, context);
}

export function isHttpError(error: Error): error is HttpError {
  return error instanceof HttpError;
}

export function isNetworkError(error: Error): error is NetworkError {
  return error instanceof NetworkError;
}

function isCanceledRequestError(error: unknown): boolean {
  return axios.isCancel(error);
}
