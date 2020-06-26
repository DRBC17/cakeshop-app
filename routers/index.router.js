const { Router } = require("express");
const router = Router();

const indexController = require("../controllers/index.controller");

module.exports = function () {
  router.get("/", indexController.home);

  return router;
};
