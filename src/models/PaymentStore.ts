import pool from "../database";
import Logger from "../classes/logger/Logger";
import DatabaseError from "../classes/base_errors/DatabaseError";

const logger = new Logger("database_logs.txt");

export interface Payment {
  id?: number;
  stripe_reference: string;
  total: number;
  payment_status: string;
}

export class PaymentStore {
  private DATABASE_TABLE = "payments";

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

      // throw 404 if paymentid not valid...

      return result.rows[0];
    } catch (err: unknown) {
      logger.error(err);

      throw new DatabaseError();
    }
  }
}
