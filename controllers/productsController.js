// Importar los modelos
const Product = require("../models/product");
const ImageProduct = require("../models/imageProduct");
const Category = require("../models/category");
// Importamos unlink de fs-extra
const { unlink } = require("fs-extra");
// Importamos path
const path = require("path");
// Importar Moment.js
const moment = require("moment");
moment.locale("es");
// Importar slug
const slug = require("slug");
// Importar shortid
const shortid = require("shortid");

//Renderizamos el formulario para agregar producto.
exports.formularioAgregarProducto = async (req, res, next) => {
  const { auth } = res.locals.usuario;
  try {
    //Busca las categorías existentes
    categories = await Category.findAll();
    //Las enviá para mostrarlas en el formulario
    res.render("product/addProduct", {
      title: "Agregar producto | GloboFiestaCake's",
      auth,
      categories,
    });
  } catch (error) {
    // En caso de haber errores lo guardamos en messages y volvemos a cargar el formulario
    const messages = { error };
    res.render("product/addProduct", {
      title: "Agregar producto | GloboFiestaCake's",
      auth,
      messages,
    });
  }
};

// Creamos un producto
exports.crearProducto = async (req, res, next) => {
  // Obtenemos por destructuring los datos
  const producto = req.body;
  const { filename, originalname, mimetype, size } = req.file;
  const { categoryId, name, description, unitPrice } = producto;
  const { auth } = res.locals.usuario;
  let messages = [];

  if (!categoryId) {
    messages.push({
      error: "¡Se debe seleccionar una categoría!",
      type: "alert-danger",
    });
  }

  if (isNaN(unitPrice)) {
    messages.push({
      error: "¡El precio debe ser un numero!",
      type: "alert-danger",
    });
  }

  if (messages.length) {
    if (req.file) {
      // En caso de error eliminamos la imagen que se guardo en el servidor
      await unlink(path.resolve("./public/img/uploads/" + filename));
    }

    const categories = await Category.findAll();
    //Las enviá para mostrarlas en el formulario
    res.render("product/addProduct", {
      title: "Agregar producto | GloboFiestaCake's",
      auth,
      categories,
      producto,
      messages,
    });
  } else {
    try {
      // Guardar los datos de la imagen
      await ImageProduct.create({
        fileName: filename,
        path: "/img/uploads/" + filename,
        originalName: originalname,
        mimeType: mimetype,
        size: size,
      });

      //Buscamos el id de la ultima imagen agregada
      const imageId = await ImageProduct.findOne({
        limit: 1,
        order: [["createdAt", "DESC"]],
      });

      // Guardamos el producto con el id de la imagen
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
      messages.push({
        error,
        type: "alert-danger",
      });

      if (req.file) {
        // En caso de error eliminamos la imagen que se guardo en el servidor
        await unlink(path.resolve("./public/img/uploads/" + filename));
      }

      //Busca las categorías existentes
      const categories = await Category.findAll();
      //Las enviá para mostrarlas en el formulario
      res.render("product/addProduct", {
        title: "Agregar producto | GloboFiestaCake's",
        auth,
        categories,
        producto,
        messages,
      });
    }
  }
};

// Renderizamos el formulario para los productos
exports.formularioProductos = async (req, res, next) => {
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
      res.render("product/recordBook", {
        title: "Productos | GloboFiestaCake's",
        auth,
        products: products.reverse(),
      });
    });
  } catch (error) {
    messages.push({
      error,
      type: "alert-danger",
    });
    res.render("product/recordBook", {
      title: "Productos | GloboFiestaCake's",
      auth,
      messages,
      products: products.reverse(),
    });
  }
};

// Busca un producto por su URL
exports.obtenerProductoPorUrl = async (req, res, next) => {
  const { auth } = res.locals.usuario;
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
    
    res.render("product/updateProduct", {
      title: "Productos | GloboFiestaCake's",
      auth,
      created,
      updated,
      category: category.dataValues.name,
      categories,
      products: products,
    });
  } catch (error) {
    res.redirect("/productos");
  }
};

// Actualizar los datos de un producto
exports.actualizarProducto = async (req, res, next) => {
  // Obtenemos por destructuring los datos
  let { categoryId, name, description, unitPrice } = req.body;
  const { auth } = res.locals.usuario;
  let messages = [];

  // Verificar el nombre
  if (!name) {
    messages.push({
      error: "¡Debe ingresar un nombre!",
      type: "alert-danger",
    });
  }
  // Verificar la descripción
  if (!description) {
    messages.push({
      error: "¡Debe ingresar una descripción!",
      type: "alert-danger",
    });
  }
  if (isNaN(unitPrice)) {
    messages.push({
      error: "¡El precio debe ser un numero!",
      type: "alert-danger",
    });
  }
  // Verificar la descripción
  if (!unitPrice) {
    messages.push({
      error: "¡Debe ingresar un precio!",
      type: "alert-danger",
    });
  }
  try {
    // Si hay mensajes
    if (messages.length) {
      //Actualizamos el formulario
      // Obtener el producto mediante el id
      const products = await Product.findByPk(req.params.id);

      const category = await Category.findByPk(products.dataValues.categoryId);
      // Cambiar la visualización de la fecha con Moment.js
      const created = moment(products["dataValues"].createdAt).format("LLLL");
      const updated = moment(products["dataValues"].updatedAt).fromNow();

      if (req.file) {
        const { filename } = req.file;
        // En caso de error eliminamos la imagen que se guardo en el servidor
        await unlink(path.resolve("./public/img/uploads/" + filename));
      }

      res.render("product/updateProduct", {
        title: "Actualizar producto | GloboFiestaCake's",
        auth,
        created,
        updated,
        messages,
        category: category.dataValues.name,
        products: products,
      });
    } else {
      // Si hay nueva foto procedemos a borrar la antigua
      if (req.file) {
        // Obtener el producto mediante el id
        const products = await Product.findByPk(req.params.id);

        // Obtenemos la imagen antigua del producto.
        const imageOld = await ImageProduct.findOne({
          where: {
            id: products.imageId,
          },
        });

        // Eliminamos del servidor la imagen antigua.
        await unlink(path.resolve("./public" + imageOld.dataValues.path));

        // Obtenemos los datos de la nueva imagen.
        const { filename, originalname, mimetype, size } = req.file;

        // Actualizamos los datos de la imagen
        await ImageProduct.update(
          {
            fileName: filename,
            path: "/img/uploads/" + filename,
            originalName: originalname,
            mimeType: mimetype,
            size: size,
          },
          {
            where: {
              id: products.imageId,
            },
          }
        );
        // Actualizamos los datos del producto
        await Product.update(
          {
            name: actualizarNombre(name),
            description,
            categoryId,
            unitPrice,
            url: actualizarUrl(name),
            urlImage: "/img/uploads/" + filename,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        res.redirect("/productos");
      } else {
        // En caso de no haber una nueva imagen
        // solo actualizamos los datos del producto
        await Product.update(
          {
            name: actualizarNombre(name),
            description,
            categoryId,
            unitPrice,
            url: actualizarUrl(name),
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        res.redirect("/productos");
      }
    }
  } catch (error) {
    if (req.file) {
      const { filename } = req.file;
      // En caso de error eliminamos la imagen que se guardo en el servidor
      await unlink(path.resolve("./public/img/uploads/" + filename));
    }
    res.send(error);
  }
};

// Eliminar una producto
exports.eliminarProducto = async (req, res, next) => {
  // Obtener la URL del producto por destructuring query
  const { url } = req.query;

  // Tratar de eliminar la producto
  try {
    // Obtener el producto mediante el id
    const products = await Product.findOne({
      where: {
        url,
      },
    });

    // Obtenemos la imagen antigua del producto.
    const imageOld = await ImageProduct.findOne({
      where: {
        id: products.imageId,
      },
    });

    // Eliminamos del servidor la imagen antigua.
    await unlink(path.resolve("./public" + imageOld.dataValues.path));

    await Product.destroy({
      where: {
        url,
      },
    });

    // Si el producto se puede eliminar sin problemas
    // Tipos de respuesta que puede tener un servidor
    // https://developer.mozilla.org/es/docs/Web/HTTP/Status
    res.status(200).send("Producto eliminado correctamente");
  } catch (error) {
    // Si el producto no se puede eliminar
    return next();
  }
};

function actualizarUrl(name) {
  // Convertimos en minúscula la url y le adjuntamos un código generado con shortid
  const url = slug(name).toLowerCase();

  return `${url}_${shortid.generate()}`;
}

function actualizarNombre(name) {
  // Convierte el nombre al formato camelCase

  return name.camelCase();
}

// Métodos personalizados
String.prototype.camelCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
