import { type ApiErrorStatusCode } from '@/shared/constant';

export class ApiError extends Error {
  readonly code: number;
  readonly errorStatusCode: ApiErrorStatusCode;

  constructor(
    message: string,
    options: { code: number; errorStatusCode: ApiErrorStatusCode }
  ) {
    super(message);

    this.name = `ApiError`;
    this.code = options.code;
    this.errorStatusCode = options.errorStatusCode;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
