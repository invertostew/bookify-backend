import { DatabaseError as pgDatabaseError } from "pg";
import moment from "moment";
import bcrypt from "bcrypt";

import pool from "../database";
import Logger from "../classes/logger/Logger";
import DatabaseError from "../classes/base_errors/DatabaseError";
import NotFoundError from "../classes/base_errors/user_facing_errors/NotFoundError";
import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";
import ValidationError from "../classes/base_errors/database_errors/ValidationError";

const { APP_URL, MOMENT_FORMAT, BCRYPT_PEPPER, SALT_ROUNDS } = process.env;
const databaseErrorLogger = new Logger("database_errors.txt");
const databaseDebugLogger = new Logger("database_debug.txt");

export interface User {
  id?: number;
  username: string;
  email_address: string;
  password: string;
  first_name: string;
  last_name: string;
  role_id: number;
}

export class UserStore {
  private DATABASE_TABLE = "users";

  public async index(): Promise<User[]> {
    try {
      const connection = await pool.connect();
      const sql = `
      SELECT
        *
      FROM
        ${this.DATABASE_TABLE}
      `;
      const result = await connection.query(sql);

      connection.release();

      return result.rows;
    } catch (err: unknown) {
      const timestamp = moment().format(MOMENT_FORMAT);

      databaseErrorLogger.error(timestamp, err);

      throw new DatabaseError();
    }
  }

  public async show(id: number): Promise<User> {
    try {
      const connection = await pool.connect();
      const sql = `
        SELECT
          *
        FROM
          ${this.DATABASE_TABLE}
        WHERE
          id = $1
      `;
      const result = await connection.query(sql, [id]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${APP_URL}/api/users/${id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no user with id '${id}'`
        );
      }

      return result.rows[0];
    } catch (err: unknown) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(err.instance, err.type, err.title, err.detail);
      } else {
        const timestamp = moment().format(MOMENT_FORMAT);

        databaseErrorLogger.error(timestamp, err);

        throw new DatabaseError();
      }
    }
  }

  public async create(user: User): Promise<User> {
    try {
      const connection = await pool.connect();
      const sql = `
        INSERT INTO ${this.DATABASE_TABLE} (
          username,
          email_address,
          password_digest,
          first_name,
          last_name,
          role_id
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          (SELECT id FROM roles WHERE role = $6)
        ) RETURNING
          *
      `;

      const hashedPassword = bcrypt.hashSync(
        user.password + BCRYPT_PEPPER,
        parseInt(SALT_ROUNDS as string, 10)
      );

      const result = await connection.query(sql, [
        user.username,
        user.email_address,
        hashedPassword,
        user.first_name,
        user.last_name,
        "user"
      ]);

      connection.release();

      return result.rows[0];
    } catch (err: unknown) {
      const timestamp = moment().format(MOMENT_FORMAT);

      if (err instanceof pgDatabaseError) {
        databaseDebugLogger.debug(timestamp, err.message);

        throw new ValidationError(err);
      }

      databaseErrorLogger.error(timestamp, err);

      throw new DatabaseError();
    }
  }

  public async update(user: User): Promise<User> {
    try {
      const connection = await pool.connect();
      const sql = `
        UPDATE
          ${this.DATABASE_TABLE}
        SET
          username = $1,
          email_address = $2,
          password_digest = $3,
          first_name = $4,
          last_name = $5,
          role_id = $6
        WHERE
          id = $7
        RETURNING
          *
      `;
      const result = await connection.query(sql, [
        user.username,
        user.email_address,
        user.password,
        user.first_name,
        user.last_name,
        user.role_id,
        user.id
      ]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${APP_URL}/api/users/${user.id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no user with id '${user.id}'`
        );
      }

      return result.rows[0];
    } catch (err: unknown) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(err.instance, err.type, err.title, err.detail);
      } else {
        const timestamp = moment().format(MOMENT_FORMAT);

        databaseErrorLogger.error(timestamp, err);

        throw new DatabaseError();
      }
    }
  }

  public async destroy(id: number): Promise<User> {
    try {
      const connection = await pool.connect();
      const sql = `
        DELETE FROM
          ${this.DATABASE_TABLE}
        WHERE
          id = $1
        RETURNING
          *
      `;
      const result = await connection.query(sql, [id]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${APP_URL}/api/users/${id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no user with id '${id}'`
        );
      }

      return result.rows[0];
    } catch (err: unknown) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(err.instance, err.type, err.title, err.detail);
      } else {
        const timestamp = moment().format(MOMENT_FORMAT);

        databaseErrorLogger.error(timestamp, err);

        throw new DatabaseError();
      }
    }
  }

  public async authenticate(username: string, password: string): Promise<User> {
    try {
      const connection = await pool.connect();
      const sql = `
        SELECT
          id,
          password_digest,
          role_id
        FROM
          ${this.DATABASE_TABLE}
        WHERE
          username = $1
      `;
      const result = await connection.query(sql, [username]);

      if (!result.rows.length) {
        throw new BadRequestError(
          `${APP_URL}/api/users/authenticate`,
          `${APP_URL}/api/problem/username-not-found`,
          "Username not found",
          `The username '${username}' does not exist`
        );
      }

      const user = result.rows[0];

      if (!bcrypt.compareSync(password + BCRYPT_PEPPER, user.password_digest)) {
        throw new BadRequestError(
          `${APP_URL}/api/users/authenticate`,
          `${APP_URL}/api/problem/incorrect-password`,
          "Password is incorrect",
          "The password you entered was incorrect, please try again"
        );
      }

      return user;
    } catch (err: unknown) {
      if (err instanceof BadRequestError) {
        throw new BadRequestError(
          err.instance,
          err.type,
          err.title,
          err.detail
        );
      } else {
        const timestamp = moment().format(MOMENT_FORMAT);

        databaseErrorLogger.error(timestamp, err);

        throw new DatabaseError();
      }
    }
  }
}
