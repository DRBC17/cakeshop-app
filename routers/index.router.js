const { Router } = require("express");
const routes = Router();

//Controladores
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");

module.exports = function () {
  routes.get("/registrate", usersController.formularioCrearCuenta);
  routes.post("/registrate", usersController.CrearCuenta);
  return routes;
};
