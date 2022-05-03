import { Request, Response, NextFunction } from "express";
import moment from "moment";

import pool from "../database";
import Logger from "../classes/logger/Logger";
import UnauthorisedError from "../classes/base_errors/user_facing_errors/UnauthorisedError";
import DatabaseError from "../classes/base_errors/DatabaseError";

const { APP_URL, MOMENT_FORMAT } = process.env;
const databaseErrorLogger = new Logger("database_errors.txt");

const isSuperUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { user } = res.locals;

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
    const result = await connection.query(sql, [user.role_id]);

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
    const timestamp = moment().format(MOMENT_FORMAT);

    databaseErrorLogger.error(timestamp, err);

    throw new DatabaseError();
  }
};

export default isSuperUser;
