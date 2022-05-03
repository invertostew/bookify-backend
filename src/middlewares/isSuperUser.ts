import { Request, Response, NextFunction } from "express";

import UnauthorisedError from "../classes/base_errors/user_facing_errors/UnauthorisedError";

const { APP_URL } = process.env;

const isSuperUser = (req: Request, res: Response, next: NextFunction): void => {
  const { user } = res.locals;

  // change this implementation later to query the db for "superuser"
  if (user.role_id !== 3) {
    throw new UnauthorisedError(
      `${req.baseUrl}${req.path}`,
      `${APP_URL}/api/problem/unauthorised`,
      "User not authorised",
      "You must be a super user to access this resource"
    );
  }

  next();
};

export default isSuperUser;
