const homeController = require("../controllers/home");

module.exports = (router) => {
  router.get("/", homeController.index);
  router.get("/about", homeController.about);
};
