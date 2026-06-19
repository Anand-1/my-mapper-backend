import winston from "winston";
import config from "../config/env";

const logger = winston.createLogger({
  level: config.nodeEnv === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: {
    service: "my-mapper-backend",
  },
  transports: [new winston.transports.Console()],
});

export default logger;
