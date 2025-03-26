import express, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { getAccessToken } from "../services/generateToken";
import { BadRequestError } from "@ticketsappchinmay/common";
import "express-async-errors";
const router = express.Router();
router.post("/api/users/refresh-token", async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (refreshToken === undefined) {
    return new BadRequestError("Refresh Token Not Found");
  }

  const payload: any = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  );
  const user = await User.findById(payload.id);

  if (!user) {
    return new BadRequestError("User Not Found");
  }

  const newAccessToken = getAccessToken({
    id: payload.id,
    email: payload.email,
  });

  res.cookie("accessToken", newAccessToken, {});
  return res.status(200).send({ user, accessToken: newAccessToken });
});

export { router as refreshToken };
