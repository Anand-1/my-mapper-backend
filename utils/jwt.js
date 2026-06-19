const jwt = require("jsonwebtoken");
const config = require("../config/env");

const getJwtSecret = () => {
  if (config.jwtSecret) {
    return config.jwtSecret;
  }

  if (config.nodeEnv === "production") {
    throw new Error("JWT_SECRET must be configured in production");
  }

  return "development-only-jwt-secret";
};

const publicUserFields = (user) => ({
  email: user.email,
  name: user.name,
  picture: user.picture,
});

/**
 * Creates the short-lived application token issued after a trusted login.
 * Keep the payload small so tokens stay cheap to send and easy to rotate.
 */
const signAuthToken = (user) =>
  jwt.sign(publicUserFields(user), getJwtSecret(), {
    expiresIn: config.jwtExpiresIn,
    subject: user.email,
  });

/**
 * Verifies a JWT and returns the decoded user payload.
 * jsonwebtoken throws for missing, expired, malformed, or tampered tokens.
 */
const verifyAuthToken = (token) => jwt.verify(token, getJwtSecret());

module.exports = {
  signAuthToken,
  verifyAuthToken,
};
