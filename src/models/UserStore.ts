import moment from "moment";
import bcrypt from "bcrypt";

import pool from "../database";
import Logger from "../classes/logger/Logger";
import DatabaseError from "../classes/base_errors/DatabaseError";
import NotFoundError from "../classes/base_errors/user_facing_errors/NotFoundError";
import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";

const { APP_URL, MOMENT_FORMAT, BCRYPT_PEPPER, SALT_ROUNDS } = process.env;
const logger = new Logger("database_errors.txt");

export interface User {
  id?: number;
  username: string;
  emailAddress: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
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
    } catch (err) {
      const timestamp = moment().format(MOMENT_FORMAT);
      const errString = JSON.stringify(err);

      logger.error(timestamp, errString);

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
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(err.instance, err.type, err.title, err.detail);
      } else {
        const timestamp = moment().format(MOMENT_FORMAT);
        const errString = JSON.stringify(err);

        logger.error(timestamp, errString);

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
          $6
        ) RETURNING
          *
      `;

      const passwordDigest = bcrypt.hashSync(
        user.password + BCRYPT_PEPPER,
        parseInt(SALT_ROUNDS as string, 10)
      );

      const result = await connection.query(sql, [
        user.username,
        user.emailAddress,
        passwordDigest,
        user.firstName,
        user.lastName,
        user.roleId
      ]);

      connection.release();

      return result.rows[0];
    } catch (err) {
      const timestamp = moment().format(MOMENT_FORMAT);
      const errString = JSON.stringify(err);

      logger.error(timestamp, errString);

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
        user.emailAddress,
        user.password,
        user.firstName,
        user.lastName,
        user.roleId,
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
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(err.instance, err.type, err.title, err.detail);
      } else {
        const timestamp = moment().format(MOMENT_FORMAT);
        const errString = JSON.stringify(err);

        logger.error(timestamp, errString);

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
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(err.instance, err.type, err.title, err.detail);
      } else {
        const timestamp = moment().format(MOMENT_FORMAT);
        const errString = JSON.stringify(err);

        logger.error(timestamp, errString);

        throw new DatabaseError();
      }
    }
  }

  public async authenticate(username: string, password: string): Promise<User> {
    try {
      const connection = await pool.connect();
      const sql = `
        SELECT
          password_digest
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
    } catch (err) {
      if (err instanceof BadRequestError) {
        throw new BadRequestError(
          err.instance,
          err.type,
          err.title,
          err.detail
        );
      } else {
        const timestamp = moment().format(MOMENT_FORMAT);
        const errString = JSON.stringify(err);

        logger.error(timestamp, errString);

        throw new DatabaseError();
      }
    }
  }
}
