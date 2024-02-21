import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface Error {
  statusCode?: number;
  name?: string;
  code?: number;
  message?: string;
  keyValue?: Record<string, string | number>;
  errors?: object;
  value?: string;
}

function errorHandlerMid(err: Error, req: Request, res: Response, next: NextFunction) {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (err.name === "ValidateError") {
    customError.msg = Object.values(err.errors!)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue!
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
}

export default errorHandlerMid;
