// Importar los modelos
const Product = require("../models/product");
const ImageProduct = require("../models/imageProduct");
const Category = require("../models/category");

// Importar Moment.js
const moment = require("moment");
moment.locale("es");
// Renderizar el formulario de la tienda
exports.formularioTiendaHome = (req, res, next) => {
  const { auth } = res.locals.usuario;
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
        messages,
      });
    }
  }
};
