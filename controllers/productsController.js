const Product = require("../models/product");
const ImageProduct = require("../models/imageProduct");

exports.formularioProductos = (req, res, next) => {
  res.render("product/recordBook", {
    title: "Productos | GloboFiestaCake's",
    authAdmin: "yes",
  });
};

exports.CrearCuenta = async (req, res, next) => {
  // Obtenemos por destructuring los datos
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    phone,
  } = req.body;
};
