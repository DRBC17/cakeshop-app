// Importar modelos
const Product = require("../models/product");
const ImageProduct = require("../models/imageProduct");
const Category = require("../models/category");

exports.formularioProductos = (req, res, next) => {
  res.render("product/recordBook", {
    title: "Productos | GloboFiestaCake's",
    authAdmin: "yes",
  });
};

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
    });

    res.render("product/recordBook", {
      title: "Productos | GloboFiestaCake's",
      authAdmin: "yes",
    });
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
