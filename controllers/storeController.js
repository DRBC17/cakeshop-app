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
     res.redirect('/iniciar_sesion');
  }
};
