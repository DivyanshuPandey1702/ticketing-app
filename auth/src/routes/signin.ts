import express from "express";
import { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@ticketsappchinmay/common";
import { User } from "../models/user";
import { Password } from "../services/password";
import { getAccessToken, getRefreshToken } from "../services/generateToken";

import "express-async-errors";
const router = express.Router();
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("you must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(email, password);
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credential");
    }

    const payload = { id: existingUser.id, email: existingUser.email };
    const accessToken = getAccessToken(payload);
    const refreshToken = getRefreshToken(payload);

    // const userJwt = jwt.sign(
    //   {
    //     id: existingUser.id,
    //     email: existingUser.email,
    //   },
    //   process.env.JWT_KEY!
    // );

    //Store it on session object
    // req.session = { jwt: userJwt };

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      // path: "/api/users/refresh-token",
      path: "/",
    });

    res.cookie("accessToken", accessToken, {});

    res.status(200).send({ existingUser, accessToken });
  }
);

export { router as signinRouter };
