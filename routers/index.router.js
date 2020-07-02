const { Router } = require("express");
const routes = Router();

//Controladores
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");
const storeController = require("../controllers/storeController");
const productsController = require("../controllers/productsController");
const categoryController = require("../controllers/categoryController");
const authAdminController = require("../controllers/authAdmin");

module.exports = function () {
  //Usuario
  routes.get("/registrate", usersController.formularioCrearCuenta);
  routes.post("/registrate", usersController.CrearCuenta);

  routes.get("/iniciar_sesion", usersController.formularioIniciarSesion);
  routes.post("/iniciar_sesion", authController.autenticarUsuario);
  routes.get("/cerrar_sesion", authController.cerrarSesion);

  routes.get(
    "/cuenta",
    authController.usuarioAutenticado,
    usersController.formularioCuenta
  );
  routes.post(
    "/actualizar_cuenta",
    authController.usuarioAutenticado,
    usersController.actualizarUsuario
  );
  routes.get(
    "/actualizar_cuenta",
    authController.usuarioAutenticado,
    usersController.recargarCuenta
  );

  //Categorías
  routes.get("/categorias",
  authController.usuarioAutenticado,
  authAdminController.adminAutenticado,
  categoryController.formularioCategorias
  );
  routes.get("/agregar_categoria",
  authController.usuarioAutenticado,
  authAdminController.adminAutenticado,
  categoryController.formularioCrearCategoria,
  );
  routes.post("/agregar_categoria",
  authController.usuarioAutenticado,
  authAdminController.adminAutenticado,
  categoryController.CrearCategoria,
  );
  routes.get("/actualizar_categoria/:url",
  authController.usuarioAutenticado,
  authAdminController.adminAutenticado,
  categoryController.obtenerCategoriaPorUrl,
  );
  routes.post("/actualizar_categoria/:id",
  authController.usuarioAutenticado,
  authAdminController.adminAutenticado,
  categoryController.actualizarCategoria,
  );
  

  //Productos
  routes.get("/productos",
  authController.usuarioAutenticado,
  authAdminController.adminAutenticado,
  productsController.formularioProductos
  );

  //Tienda
  routes.get(
    "/",
    authController.usuarioAutenticado,
    storeController.formularioTiendaHome
  );
  return routes;
};
