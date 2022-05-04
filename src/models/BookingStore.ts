import pool from "../database";
import Logger from "../classes/logger/Logger";
import DatabaseError from "../classes/base_errors/DatabaseError";
import NotFoundError from "../classes/base_errors/user_facing_errors/NotFoundError";

const { APP_URL } = process.env;
const logger = new Logger("database_logs.txt");

export interface Booking {
  id?: number;
  booking: number;
  user_id: number;
  service_id: number;
  payment_id: number;
}

export class BookingStore {
  private DATABASE_TABLE = "bookings";

  public async index(): Promise<Booking[]> {
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

  public async show(id: number): Promise<Booking> {
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
          `${APP_URL}/api/bookings/${id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no booking with id '${id}'`
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

  public async create(booking: Booking): Promise<Booking> {
    try {
      const connection = await pool.connect();
      const sql = `
        INSERT INTO ${this.DATABASE_TABLE} (
          booking,
          user_id,
          service_id,
          payment_id
        ) VALUES (
          $1,
          $2,
          $3,
          $4
        ) RETURNING
          *
      `;
      const result = await pool.query(sql, [
        booking.booking,
        booking.user_id,
        booking.service_id,
        booking.payment_id
      ]);

      connection.release();

      return result.rows[0];
    } catch (err: unknown) {
      logger.error(err);

      throw new DatabaseError();
    }
  }

  public async update(booking: Booking): Promise<Booking> {
    try {
      const connection = await pool.connect();
      const sql = `
        UPDATE
          ${this.DATABASE_TABLE}
        SET
          booking = $1,
          user_id = $2,
          service_id = $3,
          payment_id = $4
        WHERE
          id = $5
        RETURNING
          *
      `;
      const result = await pool.query(sql, [
        booking.booking,
        booking.user_id,
        booking.service_id,
        booking.payment_id,
        booking.id
      ]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${APP_URL}/api/bookings/${booking.id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no booking with id '${booking.id}'`
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

  public async destroy(id: number): Promise<Booking> {
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
          `${APP_URL}/api/bookings/${id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no booking with id '${id}'`
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
}
