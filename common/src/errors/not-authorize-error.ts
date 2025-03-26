import { CustomError } from "./custom-error";

export class NotAuthorizeError extends CustomError {
  statusCode: number = 401;

  constructor() {
    super("Not Authorize");
    Object.setPrototypeOf(this, NotAuthorizeError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: "Not authorized" }];
  }
}
