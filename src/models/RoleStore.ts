import moment from "moment";

import pool from "../database";
import Logger from "../classes/logger/Logger";
import DatabaseError from "../classes/base_errors/DatabaseError";
import NotFoundError from "../classes/base_errors/user_facing_errors/NotFoundError";

const { APP_URL, MOMENT_FORMAT } = process.env;
const logger = new Logger("database_errors.txt");

export interface Role {
  id?: number;
  role: string;
}

export class RoleStore {
  private DATABASE_TABLE = "roles";

  public async index(): Promise<Role[]> {
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

  public async show(id: number): Promise<Role> {
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
          `${APP_URL}/api/roles/${id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no role with id '${id}'`
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

  public async create(role: Role): Promise<Role> {
    try {
      const connection = await pool.connect();
      const sql = `
        INSERT INTO ${this.DATABASE_TABLE} (
          role
        ) VALUES (
          $1
        ) RETURNING
          *
      `;
      const result = await connection.query(sql, [role.role]);

      connection.release();

      return result.rows[0];
    } catch (err) {
      const timestamp = moment().format(MOMENT_FORMAT);
      const errString = JSON.stringify(err);

      logger.error(timestamp, errString);

      throw new DatabaseError();
    }
  }

  public async update(role: Role): Promise<Role> {
    try {
      const connection = await pool.connect();
      const sql = `
        UPDATE
          ${this.DATABASE_TABLE}
        SET
          role = $1
        WHERE
          id = $2
        RETURNING
          *
      `;
      const result = await connection.query(sql, [role.role, role.id]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${APP_URL}/api/roles/${role.id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no role with id '${role.id}'`
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

  public async destroy(id: number): Promise<Role> {
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
          `${APP_URL}/api/roles/${id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no role with id '${id}'`
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
}
