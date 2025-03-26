import express from "express";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signoutRouter } from "./routes/signout";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { refreshToken } from "./routes/refreshToken";
import { googleLogin } from "./routes/googleSignIn";
import { errorHandler, NotFoundError } from "@ticketsappchinmay/common";
import passport from "passport";
import session from "express-session";
import "./services/auth";

import cors from "cors";

const cookieParser = require("cookie-parser");

import "express-async-errors";

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true, // Use HTTPS
      httpOnly: true, // Prevent JavaScript access
      sameSite: "none", // For cross-origin cookies
    },
  })
);

app.set("trust proxy", true);
app.use(json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://ticketing.dev");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true"); // If using cookies
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(
  cors({
    origin: "https://ticketing.dev", // Frontend URL
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true, // Allow cookies
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(currentUserRouter);
app.use(refreshToken);
app.use(signoutRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(googleLogin);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
