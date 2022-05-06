import { Request, Response, NextFunction } from "express";

import pool from "../database";
import Logger from "../classes/logger/Logger";
import UnauthorisedError from "../classes/base_errors/user_facing_errors/UnauthorisedError";
import DatabaseError from "../classes/base_errors/DatabaseError";

const { APP_URL } = process.env;
const logger = new Logger("database_logs.txt");

const isSuperUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { decoded } = res.locals;

  try {
    const connection = await pool.connect();
    const sql = `
      SELECT
        role
      FROM
        roles
      WHERE
        id = $1
    `;
    const result = await connection.query(sql, [decoded.role_id]);

    connection.release();

    if (result.rows[0].role !== "superuser") {
      throw new UnauthorisedError(
        `${req.baseUrl}${req.path}`,
        `${APP_URL}/api/problem/unauthorised`,
        "User not authorised",
        "You must be a super user to access this resource"
      );
    }

    next();
  } catch (err) {
    if (err instanceof UnauthorisedError) {
      throw new UnauthorisedError(
        err.instance,
        err.type,
        err.title,
        err.detail
      );
    }

    logger.error(err);

    throw new DatabaseError();
  }
};

export default isSuperUser;
