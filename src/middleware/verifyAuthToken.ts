import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  if (!JWT_SECRET) {
    throw new Error("error");
  }

  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(" ")[1] || "";
    const decoded = jwt.verify(token, JWT_SECRET);

    res.locals.user = decoded;

    console.log(res.locals.user);

    next();
  } catch (err) {
    res.sendStatus(401);
  }
};

export default verifyAuthToken;
