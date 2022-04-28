import ApplicationError from "./ApplicationError";

class UserFacingError extends ApplicationError {
  public instance: string;

  constructor(instance: string, ...args: [string, string, string]) {
    super(...args);

    this.instance = instance;
  }
}

export default UserFacingError;
