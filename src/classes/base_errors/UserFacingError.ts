import ApplicationError from "./ApplicationError";

class UserFacingError extends ApplicationError {
  public instance: string;

  constructor(
    instance: string,
    ...args: [type: string, title: string, detail: string]
  ) {
    super(...args);

    this.instance = instance;
  }
}

export default UserFacingError;
