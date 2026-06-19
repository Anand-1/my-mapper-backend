import Router from "@koa/router";
import * as authController from "../controllers/auth";
import authenticateJwt from "../middleware/authenticateJwt";

export default (router: Router): void => {
  router.get("/auth/google", authController.googleLogin);
  router.get("/auth/google/callback", authController.googleCallback);
  router.get("/auth/me", authenticateJwt, authController.me);
  router.post("/auth/logout", authController.logout);
};
