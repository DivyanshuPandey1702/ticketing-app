import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

// interface CustomError {
//   statusCode: number;
//   serializeErrors(): {
//     message: string;
//     field?: string;
//   }[];
// }
export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameter");

    //Only beacuse we are extending a build in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === "field") {
        return { message: err.msg, field: err.type };
      }
      return { message: err.msg };
    });
  }
}

// throw new RequestValidationError(errors);
