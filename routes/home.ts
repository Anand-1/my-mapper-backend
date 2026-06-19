import Router from "@koa/router";
import * as homeController from "../controllers/home";

export default (router: Router): void => {
  router.get("/", homeController.index);
  router.get("/about", homeController.about);
};
