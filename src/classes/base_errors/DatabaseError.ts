import ApplicationError from "./ApplicationError";

const { SERVER_URL } = process.env;

class DatabaseError extends ApplicationError {
  protected static DEFAULT_TYPE = `${SERVER_URL}/api/problem/failed-database-operation`;

  protected static DEFAULT_TITLE = "Failed to perform database operation";

  protected static DEFAULT_DETAIL =
    "There has been a database error, please check the log  files";

  constructor(
    type = DatabaseError.DEFAULT_TYPE,
    title = DatabaseError.DEFAULT_TITLE,
    detail = DatabaseError.DEFAULT_DETAIL
  ) {
    super(type, title, detail);
  }
}

export default DatabaseError;
