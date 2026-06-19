import Router from "@koa/router";
import homeRoutes from "./home";
import authRoutes from "./auth";
import inputsRoutes from "./inputs";
import carsRoutes from "./cars";

export default (router: Router): void => {
  homeRoutes(router);
  authRoutes(router);
  inputsRoutes(router);
  carsRoutes(router);
};
