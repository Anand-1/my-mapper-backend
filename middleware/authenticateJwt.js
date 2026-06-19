const config = require("../config/env");
const { verifyAuthToken } = require("../utils/jwt");

const getBearerToken = (ctx) => {
  const authorization = ctx.get("authorization");

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");
  return scheme === "Bearer" && token ? token : null;
};

/**
 * Protects Koa routes with the JWT issued by the auth controller.
 * Tokens may arrive as an Authorization bearer token or as the httpOnly cookie
 * set during the Google OAuth callback.
 */
const authenticateJwt = async (ctx, next) => {
  const token = getBearerToken(ctx) || ctx.cookies.get(config.jwtCookieName);

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Authentication required" };
    return;
  }

  try {
    ctx.state.user = verifyAuthToken(token);
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: "Invalid or expired token" };
  }
};

module.exports = authenticateJwt;
