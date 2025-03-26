import { Express } from "express";
export interface User extends Express.User {
  id: string;
  email: string;
  username: string;
}
