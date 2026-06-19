const authController = require("../controllers/auth");
const authenticateJwt = require("../middleware/authenticateJwt");

module.exports = (router) => {
  router.get("/auth/google", authController.googleLogin);
  router.get("/auth/google/callback", authController.googleCallback);
  router.get("/auth/me", authenticateJwt, authController.me);
  router.post("/auth/logout", authController.logout);
};
