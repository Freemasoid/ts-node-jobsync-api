import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomAPIError.prototype);
  }
}

class BadRequestError extends CustomAPIError {
  statusCode = StatusCodes.BAD_REQUEST;
  constructor(message: string) {
    super(message);
  }
}

class NotFoundError extends CustomAPIError {
  statusCode = StatusCodes.NOT_FOUND;
  constructor(message: string) {
    super(message);
  }
}

class UnauthenticatedError extends CustomAPIError {
  statusCode = StatusCodes.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
  }
}

export { CustomAPIError, BadRequestError, NotFoundError, UnauthenticatedError };
