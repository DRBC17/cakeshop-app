const { Router } = require("express");
const routes = Router();

// Importamos los controladores
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");
const storeController = require("../controllers/storeController");
const productsController = require("../controllers/productsController");
const categoryController = require("../controllers/categoryController");
const authAdminController = require("../controllers/authAdmin");
const homeController = require("../controllers/homeController");

module.exports = function () {
  // Inicio de Usuario
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
    usersController.formularioCuenta
  );

  routes.get("/politicas_cookies", usersController.formularioPoliticas);

  routes.get(
    "/cuenta/pedidos",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    storeController.formularioPedidosAdmin
  );
  routes.patch(
    "/pedido/:id",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    storeController.cambiarEstadoPedido
  );
  // Fin de Usuario

  //Inicio de Categorías
  routes.get(
    "/categorias",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    categoryController.formularioCategorias
  );
  routes.get(
    "/agregar_categoria",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    categoryController.formularioCrearCategoria
  );
  routes.post(
    "/agregar_categoria",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    categoryController.CrearCategoria
  );
  routes.get(
    "/actualizar_categoria/:url",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    categoryController.obtenerCategoriaPorUrl
  );
  routes.post(
    "/actualizar_categoria/:id",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    categoryController.actualizarCategoria
  );
  routes.delete(
    "/eliminar_categoria/:url",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    categoryController.eliminarCategoria
  );
  routes.post(
    "/buscar_categoria",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    categoryController.buscarCategoria
  );
  // Fin de categoria

  // Inicio de Productos
  routes.get(
    "/productos",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    productsController.formularioProductos
  );
  routes.get(
    "/agregar_producto",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    productsController.formularioAgregarProducto
  );
  routes.post(
    "/agregar_producto",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    productsController.crearProducto
  );
  routes.get(
    "/actualizar_producto/:url",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    productsController.obtenerProductoPorUrl
  );
  routes.post(
    "/actualizar_producto/:id",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    productsController.actualizarProducto
  );
  routes.delete(
    "/eliminar_producto/:url",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    productsController.eliminarProducto
  );
  routes.post(
    "/buscar_producto",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    productsController.buscarProducto
  );
  routes.patch(
    "/producto/:id",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    productsController.actualizarEstadoProducto
  );

  // Fin de productos

  // Inicio Home
  routes.get("/", homeController.formularioHome);
  // Fin Home

  // Inicio de Tienda
  routes.get("/tienda", storeController.formularioTiendaHome);
  routes.post("/tienda/buscar_producto", storeController.buscarProducto);
  routes.get("/tienda/producto/:url", storeController.obtenerProductoPorUrl);
  routes.post(
    "/tienda/agregar_al_carrito/:id",
    authController.usuarioAutenticado,
    storeController.añadirAlCarrito
  );
  routes.get(
    "/tienda/carrito",
    authController.usuarioAutenticado,
    storeController.formularioCarrito
  );

  routes.delete(
    "/tienda/eliminar_del_carrito/:id",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    storeController.eliminarDelCarrito
  );
  routes.post(
    "/tienda/terminar_compra",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    storeController.terminarCompra
  );
  routes.get("/tienda/terminar_compra", storeController.formularioTiendaHome);
  // Fin de tienda

  return routes;
};
