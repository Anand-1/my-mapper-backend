import type { Middleware } from "koa";
import config from "../config/env";

const localDevOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const allowedOrigins = new Set<string>(
  [
    config.frontendUrl,
    ...config.corsOrigins,
    ...(config.nodeEnv === "production" ? [] : localDevOrigins),
  ].filter(Boolean) as string[]
);

const cors: Middleware = async (ctx, next) => {
  const requestOrigin = ctx.get("origin");

  ctx.set("Vary", "Origin");

  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    ctx.set("Access-Control-Allow-Origin", requestOrigin);
    ctx.set("Access-Control-Allow-Credentials", "true");
    ctx.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    ctx.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }

  if (ctx.method === "OPTIONS") {
    ctx.status = requestOrigin && !allowedOrigins.has(requestOrigin) ? 403 : 204;
    return;
  }

  await next();
};

export default cors;
