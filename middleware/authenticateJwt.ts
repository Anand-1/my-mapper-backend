import type { Middleware } from "koa";
import config from "../config/env";
import { verifyAuthToken } from "../utils/jwt";

const getBearerToken = (ctx: { get: (name: string) => string }): string | null => {
  const authorization = ctx.get("authorization");

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");
  return scheme === "Bearer" && token ? token : null;
};

const authenticateJwt: Middleware = async (ctx, next) => {
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

export default authenticateJwt;
