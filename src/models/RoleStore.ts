import pool from "../database";

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
      throw new Error("error...");
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
      throw new Error("error...");
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
      throw new Error("error...");
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
      throw new Error("error...");
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
      throw new Error("error...");
    }
  }
}
