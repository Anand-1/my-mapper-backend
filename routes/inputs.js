const inputsController = require("../controllers/inputs");

module.exports = (router) => {
  router.get("/inputs", inputsController.list);
  router.post("/inputs", inputsController.create);
};
