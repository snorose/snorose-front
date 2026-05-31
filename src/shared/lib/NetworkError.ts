type NetworkErrorType = 'OFFLINE' | 'TIMEOUT' | 'CONNECTION_ERROR' | 'UNKNOWN';

export class NetworkError extends Error {
  readonly type: NetworkErrorType;

  constructor(
    message: string,
    options: {
      cause: unknown;
      type: NetworkErrorType;
    }
  ) {
    super(message, { cause: options.cause });
    this.name = `NetworkError`;
    this.type = options.type;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }
}
