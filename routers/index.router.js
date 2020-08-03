// Importar Router de express
const { Router } = require("express");
const routes = Router();

// Importar expresss-validator
// https://express-validator.github.io/docs/sanitization.html
const { body } = require("express-validator");

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
  routes.post(
    "/registrate",
    // Sanitizar el contenido del formulario
    body("firstName").notEmpty().trim().escape(),
    body("lastName").notEmpty().trim().escape(),
    body("phone").notEmpty().trim().escape(),
    usersController.CrearCuenta
  );

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
    // Sanitizar el contenido del formulario
    body("firstName").notEmpty().trim().escape(),
    body("lastName").notEmpty().trim().escape(),
    body("phone").notEmpty().trim().escape(),
    usersController.actualizarUsuario
  );
  routes.get(
    "/actualizar_cuenta",
    authController.usuarioAutenticado,
    usersController.formularioCuenta
  );
  routes.post(
    "/cuenta/cambiar_password",
    authController.usuarioAutenticado,
    usersController.cambiarContraseña
  );
  routes.post(
    "/cuenta/cambiar_email",
    authController.usuarioAutenticado,
    usersController.cambiarEmail
  );

  routes.get("/politicas_de_cookies", usersController.formularioPoliticas);
  routes.get(
    "/terminos_y_condiciones",
    usersController.formularioTerminosYCondiciones
  );

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
  routes.get(
    "/cuenta/pedido/:id",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    storeController.obtenerPedidoPorIdAdmin
  );
  routes.get(
    "/cuenta/mis_pedidos",
    authController.usuarioAutenticado,
    storeController.formularioPedidos
  );
  routes.get(
    "/cuenta/mi_pedido/:id",
    authController.usuarioAutenticado,
    storeController.obtenerPedidoPorId
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
    // Sanitizar el contenido del formulario
    body("name").notEmpty().trim().escape(),
    body("description").notEmpty().trim().escape(),
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
    // Sanitizar el contenido del formulario
    body("name").notEmpty().trim().escape(),
    body("description").notEmpty().trim().escape(),
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
    // Sanitizar el contenido del formulario
    body("search").notEmpty().trim().escape(),
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
    // Sanitizar el contenido del formulario
    body("name").notEmpty().trim().escape(),
    body("description").notEmpty().trim().escape(),
    body("unitPrice").notEmpty().trim().escape(),
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
    // Sanitizar el contenido del formulario
    body("name").notEmpty().trim().escape(),
    body("description").notEmpty().trim().escape(),
    body("unitPrice").notEmpty().trim().escape(),
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
    // Sanitizar el contenido del formulario
    body("search").notEmpty().trim().escape(),
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
  routes.post(
    "/tienda/buscar_producto",
    // Sanitizar el contenido del formulario
    body("search").notEmpty().trim().escape(),
    storeController.buscarProducto
  );
  routes.get("/tienda/producto/:url", storeController.obtenerProductoPorUrl);
  routes.post(
    "/tienda/agregar_al_carrito/:id",
    authController.usuarioAutenticado,
    // Sanitizar el contenido del formulario
    body("amount").notEmpty().trim().escape(),
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
    storeController.eliminarDelCarrito
  );
  routes.post(
    "/tienda/terminar_compra",
    authController.usuarioAutenticado,
    authAdminController.adminAutenticado,
    // Sanitizar el contenido del formulario
    body("address").notEmpty().trim().escape(),
    storeController.terminarCompra
  );
  routes.get("/tienda/terminar_compra", storeController.formularioTiendaHome);
  routes.get("/tienda/eliminar_carrito", storeController.eliminarCarrito);
  routes.get(
    "/tienda/categoria/:id",
    authController.usuarioAutenticado,
    storeController.obtenerCategoriaPorId
  );
  // Fin de tienda

  // Inicio de correo

  // Reestablecer la contraseña de un usuario
  routes.get(
    "/restablecer_password",
    usersController.formularioRestablecerPassword
  );

  routes.post("/restablecer_password", authController.enviarToken);

  routes.get("/restablecer_password/:token", authController.validarToken);

  routes.post(
    "/restablecer_password/:token",
    authController.actualizarPassword
  );
  // Fin correo
  return routes;
};
