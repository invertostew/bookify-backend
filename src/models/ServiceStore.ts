import pool from "../database";
import Logger from "../classes/logger/Logger";
import DatabaseError from "../classes/base_errors/DatabaseError";
import NotFoundError from "../classes/base_errors/user_facing_errors/NotFoundError";

const { APP_URL } = process.env;
const logger = new Logger("database_logs.txt");

export interface Service {
  id?: number;
  title: string;
  description: string;
  duration: number;
  price: number;
}

export class ServiceStore {
  private DATABASE_TABLE = "services";

  public async index(): Promise<Service[]> {
    try {
      const connection = await pool.connect();
      const sql = `
        SELECT
          *
        FROM
          ${this.DATABASE_TABLE}
      `;
      const result = await pool.query(sql);

      connection.release();

      return result.rows;
    } catch (err: unknown) {
      logger.error(err);

      throw new DatabaseError();
    }
  }

  public async show(id: number): Promise<Service> {
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
      const result = await pool.query(sql, [id]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${APP_URL}/api/services/${id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no service with id '${id}'`
        );
      }

      return result.rows[0];
    } catch (err: unknown) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(err.instance, err.type, err.title, err.detail);
      }

      logger.error(err);

      throw new DatabaseError();
    }
  }

  public async create(service: Service): Promise<Service> {
    try {
      const connection = await pool.connect();
      const sql = `
        INSERT INTO ${this.DATABASE_TABLE} (
          title,
          description,
          duration,
          price
        ) VALUES (
          $1,
          $2,
          $3,
          $4
        ) RETURNING
          *
      `;
      const result = await pool.query(sql, [
        service.title,
        service.description,
        service.duration,
        service.price
      ]);

      connection.release();

      return result.rows[0];
    } catch (err: unknown) {
      logger.error(err);

      throw new DatabaseError();
    }
  }

  public async update(service: Service): Promise<Service> {
    try {
      const connection = await pool.connect();
      const sql = `
        UPDATE
          ${this.DATABASE_TABLE}
        SET
          title = $1,
          description = $2,
          duration = $3,
          price = $4
        WHERE
          id = $5
        RETURNING
          *
      `;
      const result = await pool.query(sql, [
        service.title,
        service.description,
        service.duration,
        service.price,
        service.id
      ]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${APP_URL}/api/services/${service.id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no service with id '${service.id}'`
        );
      }

      return result.rows[0];
    } catch (err: unknown) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(err.instance, err.type, err.title, err.detail);
      }

      logger.error(err);

      throw new DatabaseError();
    }
  }

  public async destroy(id: number): Promise<Service> {
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
      const result = await pool.query(sql, [id]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${APP_URL}/api/services/${id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no service with id '${id}'`
        );
      }

      return result.rows[0];
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(err.instance, err.type, err.title, err.detail);
      }

      logger.error(err);

      throw new DatabaseError();
    }
  }
}
