import DatabaseError from "../DatabaseError";

const { SERVER_URL } = process.env;

class ValidationError extends DatabaseError {
  protected status = 400;

  protected static DEFAULT_TYPE = `${SERVER_URL}/api/problem/failed-validations`;

  protected static DEFAULT_TITLE = "Failed to perform validation operation";

  protected static DEFAULT_DETAIL =
    "There has been a validation error, please check the log files";

  constructor(
    type = ValidationError.DEFAULT_TYPE,
    title = ValidationError.DEFAULT_TITLE,
    detail = ValidationError.DEFAULT_DETAIL
  ) {
    super(type, title, detail);
  }
}

export default ValidationError;
