import ApplicationError from "./ApplicationError";

const { SERVER_URL } = process.env;

class DatabaseError extends ApplicationError {
  private static DEFAULT_TYPE = `${SERVER_URL}/api/problem/failed-database-operation`;

  private static DEFAULT_TITLE = "Failed to perform database operation";

  private static DEFAULT_DETAIL =
    "There has been a database error, check the error logs";

  constructor(
    type = DatabaseError.DEFAULT_TYPE,
    title = DatabaseError.DEFAULT_TITLE,
    detail = DatabaseError.DEFAULT_DETAIL
  ) {
    super(type, title, detail);
  }
}

export default DatabaseError;
