import express, { Request, Response } from "express";
import { body } from "express-validator";
import { getAccessToken, getRefreshToken } from "../services/generateToken";

import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@ticketsappchinmay/common";
import { User } from "../models/user";
import "express-async-errors";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    // const userJwt = jwt.sign(
    //   {
    //     id: user.id,
    //     email: user.email,
    //   },
    //   process.env.JWT_KEY!
    // );
    const payload = { id: user.id, email: user.email };
    const accessToken = getAccessToken(payload);
    const refreshToken = getRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      // path: "/api/users/refresh-token",
      path: "/",
    });

    res.cookie("accessToken", accessToken, {});

    res.status(201).send({ user });
  }
);

export { router as signupRouter };
