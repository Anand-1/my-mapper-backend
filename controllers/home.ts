import type { Middleware } from "koa";

export const index: Middleware = async (ctx) => {
  ctx.body = "Welcome to Home Page";
};

export const about: Middleware = async (ctx) => {
  ctx.body = "This is About Page";
};
