export class AppError extends Error {
  constructor(code, message = '') {
    super(message);
    this.name = 'AppError';
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
