const Koa = require("koa");
const Router = require('@koa/router');
const config = require("./config/env");
const cors = require("./middleware/cors");
const errorHandler = require("./middleware/errorHandler");
const jsonBodyParser = require("./middleware/jsonBodyParser");
const logger = require("./utils/logger");
const registerRoutes = require("./routes");
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
