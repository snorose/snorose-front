import { type ApiErrorStatusCode } from '@/shared/constant';

export class ApiError extends Error {
  readonly code: number;
  readonly status: ApiErrorStatusCode;

  constructor(
    message: string,
    options: { code: number; status: ApiErrorStatusCode; cause?: unknown }
  ) {
    super(message, { cause: options.cause });
    this.name = `ApiError`;
    this.code = options.code;
    this.status = options.status;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }
}
