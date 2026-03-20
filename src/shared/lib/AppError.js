export class AppError extends Error {
  constructor(code, message = '') {
    super(message);
    this.name = 'AppError';
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
