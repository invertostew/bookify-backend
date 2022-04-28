import UserFacingError from "../UserFacingError";

class BadRequestError extends UserFacingError {
  protected status = 400;
}

export default BadRequestError;
