import { InfraErrorStatusCode } from '@/shared/constant';

export class InfraError extends Error {
  readonly status: InfraErrorStatusCode;

  constructor(
    message: string,
    options: { status: InfraErrorStatusCode; cause?: unknown }
  ) {
    super(message, { cause: options.cause });
    this.name = `InfraError`;
    this.status = options.status;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }
}
