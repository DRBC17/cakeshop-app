// Importar los modelos
const Product = require("../models/product");
const ImageProduct = require("../models/imageProduct");
const Category = require("../models/category");

// Importar Moment.js
const moment = require("moment");
moment.locale("es");
let carrito = [];

// Renderizar el formulario de la tienda
exports.formularioTiendaHome = (req, res, next) => {
  const { auth, email } = res.locals.usuario;
  let messages = [];
  let products = [];
  try {
    // Obtenemos los productos creados y lo mostramos las fecha modificadas con moment.js
    Product.findAll().then(function (products) {
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
        carrito: existeCarrito(email),
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
      carrito: existeCarrito(email),
      products: products.reverse(),
    });
  }
};

exports.buscarProducto = async (req, res, next) => {
  const { search } = req.body;
  const { auth, email } = res.locals.usuario;
  const messages = [];

  if (!search) {
    res.redirect("/tienda");
  } else {
    try {
      Product.findAll({
        where: {
          name: search,
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
            carrito: existeCarrito(email),
          });
        } else {
          messages.push({
            error: `No se encontraron resultados para: ${search}`,
            type: "alert-danger",
          });

          Product.findAll().then(function (products) {
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
              carrito: existeCarrito(email),
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
        carrito,
        messages,
      });
    }
  }
};

// Busca un producto por su URL
exports.obtenerProductoPorUrl = async (req, res, next) => {
  const { auth } = res.locals.usuario;
  if (auth) {
    try {
      //Actualizamos el formulario
      // Obtener el producto mediante la URL
      const products = await Product.findOne({
        where: {
          url: req.params.url,
        },
      });

      const category = await Category.findByPk(products.dataValues.categoryId);
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
    } catch (error) {
      res.redirect("/tienda");
    }
  } else {
    res.redirect("/iniciar_sesion");
  }
};

exports.añadirAlCarrito = (req, res, next) => {
  const { amount } = req.body;
  const { email } = res.locals.usuario;
  const idProduct = req.params.id;
  carrito.push({ email, idProduct, amount });

  let carritoPersonal = [];
  carrito.forEach((element) => {
    if (element.email === email) {
      carritoPersonal.push(element);
    }
  });
  res.redirect("/tienda");
};

exports.formularioCarrito = async (req, res, next) => {
  const { email, auth } = res.locals.usuario;

  try {
    let carritoPersonal = [];
    let total = 0;
    numero = 1;
    for (const element of carrito) {
      if (element.email === email) {
        const product = await Product.findByPk(element.idProduct);
        total = total + element.amount * product["dataValues"].unitPrice;
        carritoPersonal.push({
          numero: numero++,
          name: product["dataValues"].name,
          amount: element.amount,
          unitPrice: product["dataValues"].unitPrice,
          subTotal: element.amount * product["dataValues"].unitPrice,
        });
      }
    }
    res.render("store/cart", {
      title: "Carrito | GloboFiestaCake's",
      auth,
      carritoPersonal,
      total,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/tienda");
  }
};

function existeCarrito(email) {
  try {
    let carritoPersonal = [];
    for (const element of carrito) {
      if (element.email === email) {
        carritoPersonal.push(element);
      }
    }
    if (carritoPersonal.length) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}
