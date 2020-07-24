// Importar los modelos
const Product = require("../models/product");
const Category = require("../models/category");
const Order = require("../models/order");
const OrderDetail = require("../models/orderDetail");

// Importar Moment.js
const moment = require("moment");
moment.locale("es");
// Importar shortid
const shortid = require("shortid");
// Operador para sequelize en sus búsquedas
const { Op } = require("sequelize");

// Renderizar el formulario de la tienda
exports.formularioTiendaHome = (req, res, next) => {
  const { auth } = res.locals.usuario;
  let messages = [];
  let products = [];
  try {
    // Obtenemos los productos creados y lo mostramos las fecha modificadas con moment.js
    Product.findAll({
      where: {
        available: 1,
      },
    }).then(function (products) {
      products = products.map(function (product) {
        product.dataValues.createdAt = moment(
          product.dataValues.createdAt
        ).format("LLLL");
        product.dataValues.updatedAt = moment(
          product.dataValues.updatedAt
        ).fromNow();

        return product;
      });
      res.render("store/store", {
        title: "Tienda | GloboFiestaCake's",
        auth,
        products: products.reverse(),
        carrito: existeCarrito(req),
      });
    });
  } catch (error) {
    messages.push({
      error,
      type: "alert-danger",
    });
    res.render("store/store", {
      title: "Productos | GloboFiestaCake's",
      auth,
      messages,
      carrito: existeCarrito(req),
      products: products.reverse(),
    });
  }
};

exports.buscarProducto = async (req, res, next) => {
  const { search } = req.body;
  const { auth } = res.locals.usuario;
  const messages = [];

  if (!search) {
    res.redirect("/tienda");
  } else {
    try {
      Product.findAll({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
          available: 1,
        },
      }).then(function (products) {
        products = products.map(function (product) {
          product.dataValues.createdAt = moment(
            product.dataValues.createdAt
          ).format("LLLL");
          product.dataValues.updatedAt = moment(
            product.dataValues.updatedAt
          ).fromNow();

          return product;
        });
        if (products.length) {
          res.render("store/store", {
            title: "Tienda | GloboFiestaCake's",
            auth,
            products: products.reverse(),
            search,
            carrito: existeCarrito(req),
          });
        } else {
          messages.push({
            error: `No se encontraron resultados para: ${search}`,
            type: "alert-danger",
          });

          Product.findAll({
            where: {
              available: 1,
            },
          }).then(function (products) {
            products = products.map(function (product) {
              product.dataValues.createdAt = moment(
                product.dataValues.createdAt
              ).format("LLLL");
              product.dataValues.updatedAt = moment(
                product.dataValues.updatedAt
              ).fromNow();

              return product;
            });
            res.render("store/store", {
              title: "Tienda | GloboFiestaCake's",
              auth,
              products: products.reverse(),
              search,
              carrito: existeCarrito(req),
              messages,
            });
          });
        }
      });
    } catch (error) {
      messages.push({
        error,
        type: "alert-danger",
      });
      res.render("store/store", {
        title: "Tienda | GloboFiestaCake's",
        auth,
        products: products.reverse(),
        search,
        carrito: existeCarrito(req),
        messages,
      });
    }
  }
};

// Busca un producto por su URL
exports.obtenerProductoPorUrl = async (req, res, next) => {
  const { auth } = res.locals.usuario;
  let messages = [];
  // Si no esta registrado lo enviá a productos
  if (auth) {
    try {
      //Actualizamos el formulario
      // Obtener el producto mediante la URL
      const products = await Product.findOne({
        where: {
          url: req.params.url,
        },
      });

      // Si el producto ya no esta disponible no lo deja continuar
      if (products["dataValues"].available === true) {
        const category = await Category.findByPk(
          products.dataValues.categoryId
        );
        //Busca las categorías existentes
        const categories = await Category.findAll();
        // Cambiar la visualización de la fecha con Moment.js
        const created = moment(products["dataValues"].createdAt).format("LLLL");
        const updated = moment(products["dataValues"].updatedAt).fromNow();

        res.render("store/order", {
          title: "Realizar pedido | GloboFiestaCake's",
          auth,
          created,
          updated,
          category: category.dataValues.name,
          categories,
          products: products,
        });
      } else {
        messages.push({
          error: `El producto ya no esta disponible`,
          type: "alert-danger",
        });

        Product.findAll({
          where: {
            available: 1,
          },
        }).then(function (products) {
          products = products.map(function (product) {
            product.dataValues.createdAt = moment(
              product.dataValues.createdAt
            ).format("LLLL");
            product.dataValues.updatedAt = moment(
              product.dataValues.updatedAt
            ).fromNow();

            return product;
          });
          res.render("store/store", {
            title: "Tienda | GloboFiestaCake's",
            auth,
            products: products.reverse(),
            carrito: existeCarrito(req),
            messages,
          });
        });
      }
    } catch (error) {
      res.redirect("/tienda");
    }
  } else {
    res.redirect("/iniciar_sesion");
  }
};

exports.añadirAlCarrito = (req, res, next) => {
  const { amount } = req.body;
  const idProduct = req.params.id;
  // Verificamos si existe el carrito si no lo creamos
  if (!req.session.carrito) {
    req.session.carrito = [];
  }
  let carrito = req.session.carrito;
  carrito.push({ id: shortid.generate(), idProduct, amount });
  req.session.carrito = carrito;
  res.redirect("/tienda");
};

exports.formularioCarrito = async (req, res, next) => {
  const { auth } = res.locals.usuario;

  try {
    let carritoPersonal = [];
    let carrito = req.session.carrito;
    let total = 0;
    numero = 1;
    for (let element of carrito) {
      const product = await Product.findByPk(element.idProduct);
      total = total + element.amount * product["dataValues"].unitPrice;
      carritoPersonal.push({
        numero: numero++,
        id: element.id,
        name: product["dataValues"].name,
        amount: element.amount,
        unitPrice: product["dataValues"].unitPrice,
        subTotal: (element.amount * product["dataValues"].unitPrice).toFixed(2),
      });
    }

    if (carritoPersonal.length) {
      res.render("store/cart", {
        title: "Carrito | GloboFiestaCake's",
        auth,
        carritoPersonal,
        total: total.toFixed(2),
      });
    } else {
      res.redirect("/tienda");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/tienda");
  }
};

function existeCarrito(req) {
  try {
    // Verificamos si existe el carrito si no lo creamos
    if (!req.session.carrito) {
      req.session.carrito = [];
    }
    let carrito = req.session.carrito;
    if (carrito.length) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

exports.eliminarDelCarrito = (req, res, next) => {
  const { id } = req.params;
  let carrito = req.session.carrito;
  console.log(req.session.carrito);
  try {
    let index = 0;
    for (let element of carrito) {
      if (element.id === id) {
        carrito.splice(index, 1);
        break;
      }
      index++;
    }

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(401);
  }
};

exports.terminarCompra = async (req, res, next) => {
  const { address } = req.body;
  const { id, email, phone, auth } = res.locals.usuario;
  try {
    let carrito = req.session.carrito;
    //Crear la orden
    await Order.create({
      userId: id,
      address,
      phone,
    });
    //Buscamos el id de la ultima orden
    const order = await Order.findOne({
      limit: 1,
      order: [["createdAt", "DESC"]],
    });
    for (let element of carrito) {
      //Crear el detalle orden
      await OrderDetail.create({
        orderId: order["dataValues"].id,
        productId: element.idProduct,
        amount: element.amount,
      });
    }
    //Elimina todos los perdidos con el email del usuario
    req.session.carrito = [];

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
};
exports.eliminarCarrito = (req, res, next) => {
 //Elimina todos los perdidos con el email del usuario
 req.session.carrito = [];
  res.redirect('/tienda');
}

// Mostrar pedidos
exports.formularioPedidosAdmin = async (req, res, next) => {
  const { firstName, lastName, auth } = res.locals.usuario;

  try {
    let pedidos = [];
    const orders = await Order.findAll();
    let numero = 1;
    for (let element of orders) {
      pedidos.push({
        numero,
        id: element.id,
        name: `${firstName} ${lastName}`,
        phone: element.phone,
        updatedAt: moment(element.updatedAt).format("LLLL"),
        status: element.status,
      });
      numero++;
    }

    res.render("store/ordersAdmin", {
      title: "Pedidos | GloboFiestaCake's",
      pedidos,
      auth,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.cambiarEstadoPedido = async (req, res, next) => {
  try {
    // Obtener el id del pedido
    // Patch como HTTP Verb obtiene solamente los valores a través de req.params
    const { id } = req.params;

    // Buscar la tarea a actualizar
    const pedido = await Order.findByPk(id);
    // Actualizar el estado del pedido
    // ternary operator
    const estado = pedido.status == 0 ? 1 : 0;
    await Order.update(
      { status: estado },
      {
        where: {
          id,
        },
      }
    );

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(401);
  }
};

exports.obtenerPedidoPorIdAdmin = async (req, res, next) => {
  const { auth } = res.locals.usuario;
  const { id } = req.params;
  try {
    const pedido = await Order.findByPk(id);
    let carritoPersonal = [];
    let carrito = await OrderDetail.findAll({
      where: {
        OrderId: id,
      },
    });

    let total = 0;
    numero = 1;
    for (let element of carrito) {
      const product = await Product.findByPk(element.productId);
      total = total + element.amount * product["dataValues"].unitPrice;
      carritoPersonal.push({
        numero: numero++,
        id: element.id,
        name: product["dataValues"].name,
        amount: element.amount,
        unitPrice: product["dataValues"].unitPrice,
        subTotal: (element.amount * product["dataValues"].unitPrice).toFixed(2),
      });
    }

    res.render("store/orderDetailAdmin", {
      title: "Detalles del pedido | GloboFiestaCake's",
      auth,
      carritoPersonal,
      address: pedido["dataValues"].address,
      phone: pedido["dataValues"].phone,
      total: total.toFixed(2),
    });
  } catch (error) {
    console.log(error);
    res.redirect("/cuenta/pedidos");
  }
};

// Mostrar pedidos del cliente
exports.formularioPedidos = async (req, res, next) => {
  const { id, firstName, lastName, auth } = res.locals.usuario;

  try {
    let pedidos = [];
    const orders = await Order.findAll({
      where: { userId: id },
    });
    let numero = 1;
    for (let element of orders) {
      pedidos.push({
        numero,
        id: element.id,
        name: `${firstName} ${lastName}`,
        phone: element.phone,
        updatedAt: moment(element.updatedAt).format("LLLL"),
        status: element.status,
      });
      numero++;
    }

    res.render("store/orders", {
      title: "Mis pedidos | GloboFiestaCake's",
      pedidos,
      auth,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.obtenerPedidoPorId = async (req, res, next) => {
  const { auth } = res.locals.usuario;
  const { id } = req.params;
  try {
    const pedido = await Order.findByPk(id);
    let carritoPersonal = [];
    let carrito = await OrderDetail.findAll({
      where: {
        OrderId: id,
      },
    });

    let total = 0;
    numero = 1;
    for (let element of carrito) {
      const product = await Product.findByPk(element.productId);
      total = total + element.amount * product["dataValues"].unitPrice;
      carritoPersonal.push({
        numero: numero++,
        id: element.id,
        name: product["dataValues"].name,
        amount: element.amount,
        unitPrice: product["dataValues"].unitPrice,
        subTotal: (element.amount * product["dataValues"].unitPrice).toFixed(2),
      });
    }

    res.render("store/orderDetail", {
      title: "Detalles del pedido | GloboFiestaCake's",
      auth,
      carritoPersonal,
      address: pedido["dataValues"].address,
      phone: pedido["dataValues"].phone,
      total: total.toFixed(2),
    });
  } catch (error) {
    console.log(error);
    res.redirect("/cuenta/mis_pedidos");
  }
};
