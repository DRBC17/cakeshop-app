const { Router } = require("express");
const router = Router();

const indexController = require("../controllers/userscontroller");

module.exports = function () {
  router.get("/", indexController.home);

  return router;
};
