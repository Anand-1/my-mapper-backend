import Router from "@koa/router";
import * as inputsController from "../controllers/inputs";

export default (router: Router): void => {
  router.get("/inputs", inputsController.list);
  router.post("/inputs", inputsController.create);
};
