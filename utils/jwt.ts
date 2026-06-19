import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import config from "../config/env";
import type { GoogleUser } from "../types";

const getJwtSecret = (): string => {
  if (config.jwtSecret) {
    return config.jwtSecret;
  }

  if (config.nodeEnv === "production") {
    throw new Error("JWT_SECRET must be configured in production");
  }

  return "development-only-jwt-secret";
};

const publicUserFields = (user: GoogleUser): GoogleUser => ({
  email: user.email,
  name: user.name,
  picture: user.picture,
});

export const signAuthToken = (user: GoogleUser): string =>
  jwt.sign(publicUserFields(user), getJwtSecret(), {
    expiresIn: config.jwtExpiresIn as StringValue,
    subject: user.email,
  });

export const verifyAuthToken = (token: string): GoogleUser =>
  jwt.verify(token, getJwtSecret()) as GoogleUser;
