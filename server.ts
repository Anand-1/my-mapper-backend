import Koa from "koa";
import Router from "@koa/router";
import config from "./config/env";
import cors from "./middleware/cors";
import errorHandler from "./middleware/errorHandler";
import jsonBodyParser from "./middleware/jsonBodyParser";
import logger from "./utils/logger";
import registerRoutes from "./routes";

const app = new Koa();
const router = new Router();

app.use(errorHandler);
app.use(cors);
app.use(jsonBodyParser);

registerRoutes(router);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port, () => {
  logger.info(`Application running on port ${config.port}`);
});
