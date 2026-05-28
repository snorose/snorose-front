import { invertObject } from '@/shared/lib/object';

export const HTTP_STATUS_CODE = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export const HTTP_STATUS_NAME = invertObject(HTTP_STATUS_CODE);

export const INFRA_ERROR_STATUS_CODE = [
  HTTP_STATUS_CODE.BAD_GATEWAY,
  HTTP_STATUS_CODE.SERVICE_UNAVAILABLE,
  HTTP_STATUS_CODE.GATEWAY_TIMEOUT,
] as const;

type HttpStatusCode = (typeof HTTP_STATUS_CODE)[keyof typeof HTTP_STATUS_CODE];

type StrictInfraErrorCode = (typeof INFRA_ERROR_STATUS_CODE)[number];

export type InfraErrorStatusCode = StrictInfraErrorCode | (number & {});

export type ApiErrorStatusCode = Exclude<HttpStatusCode, StrictInfraErrorCode>;
