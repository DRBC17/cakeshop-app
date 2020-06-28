const { Router } = require("express");
const routes = Router();

const usersController = require("../controllers/userscontroller");

module.exports = function () {
  routes.get("/registrate", usersController.formularioCrearCuenta);
  routes.post("/registrate", usersController.CrearCuenta);
  return routes;
};
