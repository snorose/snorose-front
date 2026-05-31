type HttpErrorKind = 'API_CONTRACT' | 'UNEXPECTED_RESPONSE';

export class HttpError extends Error {
  readonly status: number;
  readonly kind: HttpErrorKind;
  readonly code?: number;

  constructor(
    message: string,
    options: {
      cause: unknown;
      status: number;
      kind: HttpErrorKind;
      code?: number;
    }
  ) {
    super(message, { cause: options.cause });
    this.name = `HttpError`;
    this.status = options.status;
    this.code = options.code;
    this.kind = options.kind;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }
}
