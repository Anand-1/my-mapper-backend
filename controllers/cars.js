const db = require("../utils/db");

exports.list = async (ctx) => {
  try {
    const result = await db.query("SELECT * FROM cars");
    ctx.body = { items: result.rows };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch cars", detail: err.message };
  }
};
