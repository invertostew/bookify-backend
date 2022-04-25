import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const {
  ENV,
  POSTGRES_USER,
  POSTGRES_PASS,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_TEST_USER,
  POSTGRES_TEST_PASS,
  POSTGRES_TEST_HOST,
  POSTGRES_TEST_PORT,
  POSTGRES_TEST_DB
} = process.env;

// eslint-disable-next-line import/no-mutable-exports
let pool: Pool;

pool = new Pool({
  user: POSTGRES_USER,
  password: POSTGRES_PASS,
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  database: POSTGRES_DB
});

if (ENV === "test") {
  pool = new Pool({
    user: POSTGRES_TEST_USER,
    password: POSTGRES_TEST_PASS,
    host: POSTGRES_TEST_HOST,
    port: Number(POSTGRES_TEST_PORT),
    database: POSTGRES_TEST_DB
  });
}

export default pool;
