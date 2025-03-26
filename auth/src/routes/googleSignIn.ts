import express from "express";
import passport from "passport";
import { Request, Response } from "express";
import "express-async-errors";
import { getAccessToken, getRefreshToken } from "../services/generateToken";
import { User } from "../types/types";

const router = express.Router();
router.get(
  "/api/users/google-signin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/api/users/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication
    const { id, email } = req?.user as User;
    console.log(id, email);
    if (id && email) {
      const accessToken = getAccessToken({
        email,
        id,
      });
      const refreshToken = getRefreshToken({
        email,
        id,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        // path: "/api/users/refresh-token",
        path: "/",
      });

      res.cookie("accessToken", accessToken, {});
    }

    res.redirect("https://ticketing.dev/");
  }
);

export { router as googleLogin };
