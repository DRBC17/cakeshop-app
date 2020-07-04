const Product = require("../models/product");
const ImageProduct = require("../models/imageProduct");

exports.formularioProductos = (req, res, next) => {
  res.render("product/recordBook", {
    title: "Productos | GloboFiestaCake's",
    authAdmin: "yes",
  });
};

exports.crearProducto = async (req, res, next) => {
  // Obtenemos por destructuring los datos
  // const {} = req.body;
  res.send(req.body);
};

exports.formularioAgregarProducto = (req, res, next) => {
  res.render("product/addProduct", {
    title: "Agregar producto | GloboFiestaCake's",
    authAdmin: "yes",
  });
};