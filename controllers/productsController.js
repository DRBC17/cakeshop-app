// Importar modelos
const Product = require("../models/product");
const ImageProduct = require("../models/imageProduct");
const Category = require("../models/category");

// Importar Moment.js
const moment = require("moment");
moment.locale("es");

exports.formularioAgregarProducto = async (req, res, next) => {
  try {
    //Busca las categorías existentes
    categories = await Category.findAll();
    //Las enviá para mostrarlas en el formulario
    res.render("product/addProduct", {
      title: "Agregar producto | GloboFiestaCake's",
      authAdmin: "yes",
      categories,
    });
  } catch (error) {
    const messages = { error };
    res.render("product/addProduct", {
      title: "Agregar producto | GloboFiestaCake's",
      authAdmin: "yes",
      messages,
    });
  }
};

exports.crearProducto = async (req, res, next) => {
  // Obtenemos por destructuring los datos
  const { filename, originalname, mimetype, size } = req.file;
  const { categoryId, name, description, unitPrice } = req.body;

  try {
    // Guardar la imagen
    await ImageProduct.create({
      fileName: filename,
      path: "/img/uploads/" + filename,
      originalName: originalname,
      mimeType: mimetype,
      size: size,
    });

    //Buscamos el id de la imagen
    const imageId = await ImageProduct.findOne({
      limit: 1,
      order: [["createdAt", "DESC"]],
    });

    // Guardar la imagen
    await Product.create({
      categoryId,
      name,
      description,
      unitPrice,
      imageId: imageId.id,
      urlImage: imageId.path,
    });

    res.redirect("/productos");
  } catch (error) {
    const messages = { error };
    //Busca las categorías existentes
    categories = await Category.findAll();
    //Las enviá para mostrarlas en el formulario
    res.render("product/addProduct", {
      title: "Agregar producto | GloboFiestaCake's",
      authAdmin: "yes",
      categories,
      messages,
    });
  }
};

exports.formularioProductos = async (req, res, next) => {
  let messages = [];
  let products = [];
  try {
    // Obtenemos las categorías creadas y lo mostramos con la fehca con tiempo
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
      res.render("product/recordBook", {
        title: "Productos | GloboFiestaCake's",
        authAdmin: "yes",
        products: products,
      });
    });
  } catch (error) {
    messages.push({
      error,
      type: "alert-danger",
    });
    res.render("product/recordBook", {
      title: "Productos | GloboFiestaCake's",
      authAdmin: "yes",
      messages,
      products: products,
    });
  }
};

// Busca un categoría por su URL
exports.obtenerProductoPorUrl = async (req, res, next) => {
  try {
    // Obtener el producto mediante la URL
    const products = await Product.findOne({
      where: {
        url: req.params.url,
      },
    });

    const category = await Category.findByPk(products.dataValues.id);

    // Cambiar la visualización de la fecha con Moment.js
    const created = moment(products["dataValues"].createdAt).format("LLLL");
    const updated = moment(products["dataValues"].updatedAt).fromNow();

    res.render("product/updateProduct", {
      title: "Productos | GloboFiestaCake's",
      authAdmin: "yes",
      created,
      updated,
      category: category.dataValues.name,
      products: products,
    });
  } catch (error) {
    res.redirect("/productos");
  }
};

// Actualizar los datos de un producto
exports.actualizarProducto = async (req, res, next) => {
  // Obtener la información enviada
};
