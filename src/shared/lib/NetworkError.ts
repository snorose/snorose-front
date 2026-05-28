export class NetworkError extends Error {
  readonly type: 'OFFLINE' | 'TIMEOUT' | 'CONNECTION_ERROR';

  constructor(
    message: string,
    option: { type: 'OFFLINE' | 'TIMEOUT' | 'CONNECTION_ERROR' }
  ) {
    super(message);
    this.name = `NetworkError`;
    this.type = option.type;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
