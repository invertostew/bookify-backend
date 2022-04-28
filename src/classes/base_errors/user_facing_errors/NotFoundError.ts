import UserFacingError from "../UserFacingError";

class NotFoundError extends UserFacingError {
  protected status = 404;
}

export default NotFoundError;
