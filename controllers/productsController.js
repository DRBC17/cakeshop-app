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
  const { filename, originalname, mimetype, size } = req.file;

  // const {
  //   categoryId,
  //   title,
  //   description,
  //   imageId,
  //   unitPrice,
  //   available,
  // } = req.body;
  try {
    //Guardar la imagen
    await ImageProduct.create({
      fileName: filename,
      path: "/img/uploads/" + filename,
      originalName: originalname,
      mimeType: mimetype,
      size: size,
    });
    res.send("Ok");
  } catch (error) {
    res.send(error);
  }
};

exports.formularioAgregarProducto = (req, res, next) => {
  res.render("product/addProduct", {
    title: "Agregar producto | GloboFiestaCake's",
    authAdmin: "yes",
  });
};
