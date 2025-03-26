import jwt from "jsonwebtoken";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

/**
 * Generate an refresh token.
 * @param payload - User payload (e.g., userId, email).
 * @returns Access token string.
 */

export const getRefreshToken = (payload: object) => {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: "7d" });
};

/**
 * Generate a access token.
 * @param payload - User payload (e.g., userId, email).
 * @returns Refresh token string.
 */

export const getAccessToken = (payload: object) => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: "15m" });
};
