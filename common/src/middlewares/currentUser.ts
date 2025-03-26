import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface userPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: userPayload;
    }
  }
}
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // No token provided; proceed without attaching `currentUser`
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as userPayload;
    req.currentUser = payload; // Attach the decoded payload to the `req` object
  } catch (err) {
    // Token verification failed; proceed without attaching `currentUser`
  }

  // if (!req.session?.jwt) {
  //   return next();
  // }

  // try {
  //   const payload = jwt.verify(
  //     req.session.jwt,
  //     process.env.JWT_KEY!
  //   ) as userPayload;
  //   req.currentUser = payload;
  // } catch (err) {}

  next();
};
