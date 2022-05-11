import pool from "../database";
import Logger from "../classes/logger/Logger";
import DatabaseError from "../classes/base_errors/DatabaseError";
import NotFoundError from "../classes/base_errors/user_facing_errors/NotFoundError";

const { SERVER_URL } = process.env;
const logger = new Logger("database_logs.txt");

export interface Payment {
  id?: number;
  stripe_reference: string;
  total: number;
  payment_status: string;
}

export class PaymentStore {
  private DATABASE_TABLE = "payments";

  public async index(): Promise<Payment[]> {
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

  public async show(id: number): Promise<Payment> {
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
          `${SERVER_URL}/api/payments/${id}`,
          `${SERVER_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no payment with id '${id}'`
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

  public async create(payment: Payment): Promise<Payment> {
    try {
      const connection = await pool.connect();
      const sql = `
        INSERT INTO ${this.DATABASE_TABLE} (
          stripe_reference,
          total,
          payment_status
        ) VALUES (
          $1,
          $2,
          $3
        ) RETURNING
          *
      `;
      const result = await pool.query(sql, [
        payment.stripe_reference,
        payment.total,
        payment.payment_status
      ]);

      connection.release();

      return result.rows[0];
    } catch (err: unknown) {
      logger.error(err);

      throw new DatabaseError();
    }
  }

  public async updatePaymentStatus(
    paymentStatus: string,
    id: number
  ): Promise<Payment> {
    try {
      const connection = await pool.connect();
      const sql = `
        UPDATE
          ${this.DATABASE_TABLE}
        SET
          payment_status = $1
        WHERE
          id = $2
      `;
      const result = await pool.query(sql, [paymentStatus, id]);

      connection.release();

      if (!result.rows[0]) {
        throw new NotFoundError(
          `${SERVER_URL}/api/payments/${id}`,
          `${SERVER_URL}/api/problem/entity-not-found`,
          "Entity not found",
          `There is no payment with id '${id}'`
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
