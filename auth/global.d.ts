import { User } from "./src/types/types"; // Path to your User type
declare module "cors" {
  import { RequestHandler } from "express";
  const cors: (options?: any) => RequestHandler;
  export = cors;
}

declare global {
  namespace Express {
    interface User extends User {}
  }
}
