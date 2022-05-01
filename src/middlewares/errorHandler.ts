/* eslint-disable @typescript-eslint/no-unused-vars */
import { Errback, Request, Response, NextFunction } from "express";

import DatabaseError from "../classes/base_errors/DatabaseError";
import UserFacingError from "../classes/base_errors/UserFacingError";

const errorHandler = (
  err: Errback,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof DatabaseError) {
    return res.status(err.statusCode).json({
      type: err.type,
      title: err.title,
      detail: err.detail,
      status: err.statusCode
    });
  }

  if (err instanceof UserFacingError) {
    return res.status(err.statusCode).json({
      type: err.type,
      title: err.title,
      detail: err.detail,
      instance: err.instance,
      status: err.statusCode
    });
  }

  return res.sendStatus(500);
};

export default errorHandler;
