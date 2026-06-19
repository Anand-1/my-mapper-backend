const logger = require("../utils/logger");

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = "Something went wrong!";

    logger.error("Unhandled request error", {
      error: err,
      method: ctx.method,
      path: ctx.path,
      status: ctx.status,
    });
  }
};

module.exports = errorHandler;
