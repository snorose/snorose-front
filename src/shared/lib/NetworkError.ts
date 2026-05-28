export type NetworkErrorType =
  | 'TIMEOUT'
  | 'OFFLINE'
  | 'CONNECTION_ERROR'
  | 'UNKNOWN';

export class NetworkError extends Error {
  readonly type: NetworkErrorType;

  constructor(message: string, option: { type: NetworkErrorType }) {
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
