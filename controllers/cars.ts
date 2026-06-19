import type { Middleware } from "koa";
import { query } from "../utils/db";

export const list: Middleware = async (ctx) => {
  try {
    const result = await query("SELECT * FROM cars ORDER BY id");
    ctx.body = { items: result.rows };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      error: "Failed to fetch cars",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
};
