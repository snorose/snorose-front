import { InfraErrorStatusCode } from '@/shared/constant';

export class InfraError extends Error {
  readonly status: InfraErrorStatusCode;

  constructor(message: string, options: { status: InfraErrorStatusCode }) {
    super(message);
    this.name = `InfraError`;
    this.status = options.status;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InfraError);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
