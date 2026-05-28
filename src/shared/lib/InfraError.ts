import { InfraErrorStatusCode } from '@/shared/constant';

export class InfraError extends Error {
  readonly errorStatusCode: InfraErrorStatusCode;

  constructor(
    message: string,
    options: { errorStatusCode: InfraErrorStatusCode }
  ) {
    super(message);

    this.name = `InfraError`;
    this.errorStatusCode = options.errorStatusCode;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InfraError);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
