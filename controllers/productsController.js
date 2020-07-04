const Product = require("../models/product");
const ImageProduct = require("../models/imageProduct");

exports.formularioProductos = (req, res, next) => {
  res.render("product/recordBook", {
    title: "Productos | GloboFiestaCake's",
    authAdmin: "yes",
  });
};

exports.formularioAgregarProducto = async (req, res, next) => {
  try {
    categories = await Category.findAll();
    res.render("product/addProduct", {
      title: "Agregar producto | GloboFiestaCake's",
      authAdmin: "yes",
      categories,
    });
  } catch (error) {
    const messages = {error}
    res.render("product/addProduct", {
      title: "Agregar producto | GloboFiestaCake's",
      authAdmin: "yes",
      categories,
      messages
    });
  }
};

exports.crearProducto = async (req, res, next) => {
  // Obtenemos por destructuring los datos
  const { filename, originalname, mimetype, size } = req.file;
  const { categoryId, name, description, unitPrice } = req.body;

  try {
    //Guardar la imagen
    // await ImageProduct.create({
    //   fileName: filename,
    //   path: "/img/uploads/" + filename,
    //   originalName: originalname,
    //   mimeType: mimetype,
    //   size: size,
    // });
    res.send("Ok");
  } catch (error) {
    res.send(error);
  }
};
