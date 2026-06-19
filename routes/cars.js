const carsController = require("../controllers/cars");

module.exports = (router) => {
  router.get("/cars", carsController.list);
};
