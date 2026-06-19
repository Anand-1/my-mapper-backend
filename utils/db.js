const { Pool } = require("pg");
const config = require("../config/env");
const logger = require("./logger");

let pool;

const getPool = () => {
  if (!pool) {
    logger.info("Creating new PostgreSQL connection pool", {
      host: config.dbHost,
      port: config.dbPort,
      database: config.dbName,
      max: 10,
    });

    pool = new Pool({
      host: config.dbHost,
      port: config.dbPort,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      max: 10,
      idleTimeoutMillis: 30000,
    });

    pool.on("error", (err) => {
      logger.error("Unexpected error on idle database client", err);
    });

    pool.on("connect", () => {
      logger.debug("New client acquired from the pool");
    });

    pool.on("remove", () => {
      logger.debug("Client removed from the pool");
    });
  }
  return pool;
};

const query = async (text, params) => {
  const start = Date.now();
  const client = await getPool().connect();

  try {
    const result = await client.query(text, params);
    const duration = Date.now() - start;

    logger.debug("Query executed", {
      query: text.substring(0, 80),
      params: params ? JSON.stringify(params) : undefined,
      rows: result.rowCount,
      duration: `${duration}ms`,
    });

    return result;
  } catch (err) {
    const duration = Date.now() - start;

    logger.error("Query failed", {
      query: text.substring(0, 80),
      params: params ? JSON.stringify(params) : undefined,
      duration: `${duration}ms`,
      error: err.message,
    });

    throw err;
  } finally {
    client.release();
  }
};

const getClient = async () => {
  const client = await getPool().connect();
  logger.debug("Transactional client acquired");
  return client;
};

module.exports = { getPool, query, getClient };
