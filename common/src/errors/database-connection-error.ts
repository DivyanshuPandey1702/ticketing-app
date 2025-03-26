import { CustomError } from "./custom-error";
export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to DataBase";
  statusCode = 500;
  constructor() {
    super("Error connection to DB");

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
