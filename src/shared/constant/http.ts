import { invertObject } from '@/shared/lib/object';

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,

  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export const HTTP_STATUS_NAME = invertObject(HTTP_STATUS);

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export type InfraErrorStatusCode =
  | typeof HTTP_STATUS.BAD_GATEWAY
  | typeof HTTP_STATUS.SERVICE_UNAVAILABLE
  | typeof HTTP_STATUS.GATEWAY_TIMEOUT;
