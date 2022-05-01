import UserFacingError from "../UserFacingError";

class UnauthorisedError extends UserFacingError {
  protected status = 401;
}

export default UnauthorisedError;
