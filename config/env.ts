import dotenv from "dotenv";

dotenv.config();

const parseCsv = (value: string | undefined): string[] =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export interface Config {
  nodeEnv: string;
  port: number;
  backendUrl: string | undefined;
  frontendUrl: string;
  corsOrigins: string[];
  googleClientId: string | undefined;
  googleClientSecret: string | undefined;
  jwtSecret: string | undefined;
  jwtExpiresIn: string;
  jwtCookieName: string;
  dbHost: string;
  dbPort: number;
  dbUser: string;
  dbPassword: string;
  dbName: string;
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  backendUrl: process.env.BACKEND_URL,
  frontendUrl: process.env.FRONTEND_URL || "http://127.0.0.1:5173",
  corsOrigins: parseCsv(process.env.CORS_ORIGINS),
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  jwtCookieName: process.env.JWT_COOKIE_NAME || "my_mapper_token",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 5431,
  dbUser: process.env.DB_USER || "postgres",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "anandraj",
};

export default config;
