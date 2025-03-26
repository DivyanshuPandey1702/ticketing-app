import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { User } from "../types/types";
import { Express } from "express";
const GOOGLE_CLIENT_ID =
  "15315820646-ep6f832j8o8ittaqqq687p2kvr93815o.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://ticketing.dev/api/users/callback",
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (err: any, user?: Express.User) => void
    ) {
      const user: User = {
        ...profile, // Spread the Profile into the User object
        email: profile.emails ? profile.emails[0].value : "", // Optional: Get email from profile
        username: profile.displayName || "", // Optional: Use displayName as username
      };

      // You can store user info in your database here
      return done(null, user);
    }
  )
);

// Serialize user into session
passport.serializeUser(
  (user: Express.User, done: (err: any, id?: any) => void) => {
    if (user) {
      done(null, user); // Store the entire User object in the session
    } else {
      done(new Error("User not found"), null); // Error case handling
    }
  }
);

// Deserialize user from session
passport.deserializeUser(
  (
    user: User,
    done: (err: Express.User | null, user?: Express.User | null) => void
  ) => {
    if (user) {
      done(null, user); // Retrieve the user from the session
    } else {
      done(new Error("User not found"), null); // Error case handling
    }
  }
);
