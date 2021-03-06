import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import UnauthorisedError from "../classes/base_errors/user_facing_errors/UnauthorisedError";

const { JWT_SECRET, SERVER_URL } = process.env;

const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(" ")[1] || "";
    const decoded = jwt.verify(token, JWT_SECRET as string);

    res.locals.decoded = decoded;

    next();
  } catch (err: unknown) {
    throw new UnauthorisedError(
      `${SERVER_URL}${req.baseUrl}${req.path}`,
      `${SERVER_URL}/api/problem/unauthorised`,
      "User not authorised",
      "You must be logged in to access this resource"
    );
  }
};

export default verifyAuthToken;
