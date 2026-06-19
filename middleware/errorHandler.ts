import type { Middleware } from "koa";
import logger from "../utils/logger";

const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = (err as { status?: number }).status || 500;
    ctx.body = "Something went wrong!";

    logger.error("Unhandled request error", {
      error: err,
      method: ctx.method,
      path: ctx.path,
      status: ctx.status,
    });
  }
};

export default errorHandler;
