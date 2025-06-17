class ApiError extends Error {
  constructor(message ="Something went wrong", statusCode,errors =[], stack= "") {
    super(message);
    this.data = null;
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    }
    else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export {ApiError}