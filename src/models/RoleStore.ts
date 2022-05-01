import moment from "moment";

import pool from "../database";
import Logger from "../classes/logger/Logger";
import DatabaseError from "../classes/base_errors/DatabaseError";

const { APP_URL, APP_PORT } = process.env;

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
      const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
      const errString = JSON.stringify(err);

      logger.error(timestamp, errString);

      throw new DatabaseError(
        `${APP_URL}:${APP_PORT}/api/problem/failed-database-operation`,
        "Failed to perform database operation",
        "There has been an error. Please check the error logs ~/logs/database_errors.txt"
      );
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

      return result.rows[0];
    } catch (err) {
      const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
      const errString = JSON.stringify(err);

      logger.error(timestamp, errString);

      throw new DatabaseError(
        `${APP_URL}:${APP_PORT}/api/problem/failed-database-operation`,
        "Failed to perform database operation",
        "There has been an error. Please check the error logs ~/logs/database_errors.txt"
      );
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
      const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
      const errString = JSON.stringify(err);

      logger.error(timestamp, errString);

      throw new DatabaseError(
        `${APP_URL}:${APP_PORT}/api/problem/failed-database-operation`,
        "Failed to perform database operation",
        "There has been an error. Please check the error logs ~/logs/database_errors.txt"
      );
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

      return result.rows[0];
    } catch (err) {
      const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
      const errString = JSON.stringify(err);

      logger.error(timestamp, errString);

      throw new DatabaseError(
        `${APP_URL}:${APP_PORT}/api/problem/failed-database-operation`,
        "Failed to perform database operation",
        "There has been an error. Please check the error logs ~/logs/database_errors.txt"
      );
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

      return result.rows[0];
    } catch (err) {
      const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
      const errString = JSON.stringify(err);

      logger.error(timestamp, errString);

      throw new DatabaseError(
        `${APP_URL}:${APP_PORT}/api/problem/failed-database-operation`,
        "Failed to perform database operation",
        "There has been an error. Please check the error logs ~/logs/database_errors.txt"
      );
    }
  }
}
