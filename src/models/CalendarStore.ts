import pool from "../database";
import Logger from "../classes/logger/Logger";
import DatabaseError from "../classes/base_errors/DatabaseError";
import NotFoundError from "../classes/base_errors/user_facing_errors/NotFoundError";
import { Service } from "./ServiceStore";
import { Booking } from "./BookingStore";

const { APP_URL } = process.env;
const logger = new Logger("database_logs.txt");

export interface Calendar {
  id?: number;
  title: string;
  user_id: number;
}

export class CalendarStore {
  private DATABASE_TABLE = "calendars";

  public async index(): Promise<Calendar[]> {
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
      logger.error(err);

      throw new DatabaseError();
    }
  }

  public async show(id: number): Promise<Calendar> {
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
          `${APP_URL}/api/calendars/${id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no calendar with id '${id}'`
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

  public async create(calendar: Calendar): Promise<Calendar> {
    try {
      const connection = await pool.connect();
      const sql = `
        INSERT INTO ${this.DATABASE_TABLE} (
          title,
          user_id
        ) VALUES (
          $1,
          $2
        ) RETURNING
          *
      `;
      const result = await connection.query(sql, [
        calendar.title,
        calendar.user_id
      ]);

      connection.release();

      return result.rows[0];
    } catch (err: unknown) {
      logger.error(err);

      throw new DatabaseError();
    }
  }

  public async update(calendar: Calendar): Promise<Calendar> {
    try {
      const connection = await pool.connect();
      const sql = `
        UPDATE
          ${this.DATABASE_TABLE}
        SET
          title = $1,
          user_id = $2
        WHERE
          id = $3
        RETURNING
          *
      `;
      const result = await connection.query(sql, [
        calendar.title,
        calendar.user_id,
        calendar.id
      ]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${APP_URL}/api/calendars/${calendar.id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no calendar with id '${calendar.id}'`
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

  public async destroy(id: number): Promise<Calendar> {
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
          `${APP_URL}/api/calendars/${id}`,
          `${APP_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no calendar with id '${id}'`
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

  // eslint-disable-next-line class-methods-use-this
  public async listCalendarServices(calendarId: number): Promise<Service[]> {
    try {
      const connection = await pool.connect();
      const sql = `
        SELECT
          *
        FROM
          services
        WHERE
          calendar_id = $1
      `;
      const result = await connection.query(sql, [calendarId]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${APP_URL}/api/calendars/${calendarId}/services`,
          `${APP_URL}/api/problem/association-not-found`,
          "Association not found",
          `Calendar with id '${calendarId}' has no associated services`
        );
      }

      return result.rows;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(err.instance, err.type, err.title, err.detail);
      }

      logger.error(err);

      throw new DatabaseError();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async listCalendarBookings(calendarId: number): Promise<Booking[]> {
    try {
      const connection = await pool.connect();
      const sql = `
        SELECT
          booking as "startDate",
          (SELECT booking + (duration ||' minutes')::interval as "endDate"),
          services.title
        FROM
          bookings
        JOIN
          services
        ON
          bookings.service_id = services.id
        WHERE
          calendar_id = $1
      `;
      const result = await connection.query(sql, [calendarId]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${APP_URL}/api/calendars/${calendarId}/bookings`,
          `${APP_URL}/api/problem/association-not-found`,
          "Association not found",
          `Calendar with id '${calendarId}' has no associated bookings`
        );
      }

      return result.rows;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(err.instance, err.type, err.title, err.detail);
      }

      logger.error(err);

      throw new DatabaseError();
    }
  }
}
