import { Request, Response, NextFunction } from "express";

import UnauthorisedError from "../classes/base_errors/user_facing_errors/UnauthorisedError";

const { SERVER_URL } = process.env;

const belongsToUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { decoded } = res.locals;
    const { id } = req.params;

    if (Number(decoded.user_id) !== Number(id)) {
      throw new UnauthorisedError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/unauthorised`,
        "User not authorised",
        "This resource does not belong to you"
      );
    }

    next();
  } catch (err: unknown) {
    if (err instanceof UnauthorisedError) {
      throw new UnauthorisedError(
        err.instance,
        err.type,
        err.title,
        err.detail
      );
    }
  }
};

export default belongsToUser;
