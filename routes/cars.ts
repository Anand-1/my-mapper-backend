import Router from "@koa/router";
import * as carsController from "../controllers/cars";

export default (router: Router): void => {
  router.get("/cars", carsController.list);
};
