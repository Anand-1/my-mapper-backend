const jsonBodyParser = async (ctx, next) => {
  if (!["POST", "PUT", "PATCH"].includes(ctx.method)) {
    await next();
    return;
  }

  if (!ctx.is("application/json")) {
    await next();
    return;
  }

  const chunks = [];

  for await (const chunk of ctx.req) {
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks).toString("utf8");

  try {
    ctx.request.body = body ? JSON.parse(body) : {};
  } catch {
    ctx.status = 400;
    ctx.body = { error: "Invalid JSON request body" };
    return;
  }

  await next();
};

module.exports = jsonBodyParser;
