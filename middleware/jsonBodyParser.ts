import type { Middleware } from "koa";

interface KoaRequestWithBody {
  body?: Record<string, unknown>;
}

const jsonBodyParser: Middleware = async (ctx, next) => {
  if (!["POST", "PUT", "PATCH"].includes(ctx.method)) {
    await next();
    return;
  }

  if (!ctx.is("application/json")) {
    await next();
    return;
  }

  const chunks: Buffer[] = [];

  for await (const chunk of ctx.req) {
    chunks.push(chunk as Buffer);
  }

  const body = Buffer.concat(chunks).toString("utf8");

  try {
    (ctx.request as unknown as KoaRequestWithBody).body = body
      ? JSON.parse(body)
      : {};
  } catch {
    ctx.status = 400;
    ctx.body = { error: "Invalid JSON request body" };
    return;
  }

  await next();
};

export default jsonBodyParser;
