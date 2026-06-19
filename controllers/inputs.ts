import type { Middleware } from "koa";
import { readInputData, appendInputData } from "../utils/inputStore";

export const list: Middleware = async (ctx) => {
  ctx.body = {
    items: await readInputData(),
  };
};

export const create: Middleware = async (ctx) => {
  const { date, input } = (ctx.request as unknown as { body?: Record<string, unknown> }).body || {};

  if (!date || !input || typeof date !== "string" || typeof input !== "string") {
    ctx.status = 400;
    ctx.body = { error: "date and input are required" };
    return;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    ctx.status = 400;
    ctx.body = { error: "date must be a valid date string" };
    return;
  }

  const data = {
    date: parsedDate.toISOString(),
    input: input.trim(),
  };

  if (!data.input) {
    ctx.status = 400;
    ctx.body = { error: "input cannot be empty" };
    return;
  }

  ctx.status = 201;
  ctx.body = {
    items: await appendInputData(data),
  };
};
