import { HTTP_STATUS_NAME, type HttpStatusCode } from '@/shared/constant';

export class ApiError extends Error {
  readonly code: number;
  readonly httpStatusCode: HttpStatusCode;

  constructor(
    message: string,
    options: { code: number; httpStatusCode: HttpStatusCode }
  ) {
    super(message);

    this.name = `ApiError [${HTTP_STATUS_NAME[options.httpStatusCode]}]`;
    this.code = options.code;
    this.httpStatusCode = options.httpStatusCode;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
