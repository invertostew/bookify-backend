class ApplicationError extends Error {
  public type: string;

  public title: string;

  public detail: string;

  protected status = 500;

  constructor(type: string, title: string, detail: string) {
    super();

    this.type = type;
    this.title = title;
    this.detail = detail;
  }

  public get statusCode() {
    return this.status;
  }
}

export default ApplicationError;
