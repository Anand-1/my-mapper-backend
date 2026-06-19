const inputStore = require("../utils/inputStore");

exports.list = async (ctx) => {
  ctx.body = {
    items: await inputStore.readInputData(),
  };
};

exports.create = async (ctx) => {
  const { date, input } = ctx.request.body || {};

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
    items: await inputStore.appendInputData(data),
  };
};
