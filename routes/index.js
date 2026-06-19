const homeRoutes = require("./home");
const authRoutes = require("./auth");
const inputsRoutes = require("./inputs");
const carsRoutes = require("./cars");

module.exports = (router) => {
  homeRoutes(router);
  authRoutes(router);
  inputsRoutes(router);
  carsRoutes(router);
};
