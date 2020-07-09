//Importamos los modelos
const Category = require("../models/category");

// Importar Moment.js
const moment = require("moment");
moment.locale("es");

// Renderizamos el formulario para las categorías
exports.formularioCategorias = async (req, res, next) => {
  const { auth } = res.locals.usuario;
  let categories = [];
  let messages = [];
  try {
    // Obtenemos las categorías creadas y
    // lo mostramos la fecha de creación y de actualización modificadas con moment.js
    Category.findAll().then(function (categories) {
      categories = categories.map(function (category) {
        category.dataValues.createdAt = moment(
          category.dataValues.createdAt
        ).format("LLLL");
        category.dataValues.updatedAt = moment(
          category.dataValues.updatedAt
        ).fromNow();

        return category;
      });
      res.render("category/categories", {
        title: "Categorías | GloboFiestaCake's",
        authAdmin: "yes",
        auth,
        categories: categories,
      });
    });
  } catch (error) {
    messages.push({
      error,
      type: "alert-danger",
    });
    res.render("category/categories", {
      title: "Categorías | GloboFiestaCake's",
      authAdmin: "yes",
      auth,
      messages,
      categories: categories,
    });
  }
};

// Renderizamos formulario para agregar una categoría
exports.formularioCrearCategoria = (req, res, next) => {
  const { auth } = res.locals.usuario;
  res.render("category/addCategory", {
    title: "Agregar categoría | GloboFiestaCake's",
    authAdmin: "yes",
    auth,
  });
};

// Creamos una categoría
exports.CrearCategoria = async (req, res, next) => {
  // Obtenemos por destructuring los datos
  const categoria = req.body;
  const { name, description } = categoria;
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

  // Si hay mensajes
  if (messages.length) {
    res.render("category/addCategory", {
      title: "Agregar categoría | GloboFiestaCake's",
      authAdmin: "yes",
      auth,
      categoria,
      messages,
    });
  } else {
    // Intentar crear una categoría
    try {
      //Crear la categoría
      await Category.create({
        name,
        description,
      });

      // Redireccionar el usuario al formulario de categorías
      res.redirect("categorias");
    } catch (error) {
      // Mensaje personalizado sobre si ya existe el nombre registrado
      if (error["name"] === "SequelizeUniqueConstraintError") {
        messages = {
          error: "¡Ya existe una categoría registrada con ese nombre!",
          type: "alert-danger",
        };
      } else {
        // Si no es el error anterior solo mandamos los mensajes
        messages = { error, type: "alert-danger" };
      }

      res.render("category/addCategory", {
        title: "Agregar categoría | GloboFiestaCake's",
        authAdmin: "yes",
        auth,
        categoria,
        messages,
      });
    }
  }
};

// Busca un categoría por su URL
exports.obtenerCategoriaPorUrl = async (req, res, next) => {
  const { auth } = res.locals.usuario;
  try {
    // Obtener la categoría mediante la URL
    const categories = await Category.findOne({
      where: {
        url: req.params.url,
      },
    });

    // Cambiar la visualización de las fechas con Moment.js
    const created = moment(categories["dataValues"].createdAt).format("LLLL");
    const updated = moment(categories["dataValues"].updatedAt).fromNow();

    res.render("category/updateCategory", {
      title: "Categorías | GloboFiestaCake's",
      authAdmin: "yes",
      auth,
      created,
      updated,
      categories: categories,
    });
  } catch (error) {
    // En caso de haber errores volvemos a cargar las categorías.
    res.redirect("/categorias");
  }
};

// Actualizar los datos de una categoría
exports.actualizarCategoria = async (req, res, next) => {
  // Obtener la información enviada
  const { name, description } = req.body;
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

  // Si hay mensajes
  if (messages.length) {
    // Enviar valores correctos si la actualización falla
    const categories = await Category.findByPk(req.params.id);
    // Cambiar la visualización de la fecha con Moment.js
    const created = moment(categories.createdAt).format("LLLL");
    const updated = moment(categories.updatedAt).fromNow();

    res.render("category/updateCategory", {
      title: "Actualizar categoría | GloboFiestaCake's",
      authAdmin: "yes",
      auth,
      messages,
      created,
      updated,
      categories: categories,
    });
  } else {
    // No existen errores ni mensajes
    try {
      await Category.update(
        { name, description },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      // Redirigir hacia las categorías
      res.redirect("/categorias");
    } catch (error) {
      // Mensaje personalizado sobre si el nombre ya existe
      if (error["name"] === "SequelizeUniqueConstraintError") {
        messages.push({
          error: "¡Ya existe una categoría con ese nombre¡",
          type: "alert-danger",
        });
      } else {
        messages.push({ error, type: "alert-danger" });
      }

      // Enviar valores correctos si la actualización falla
      const categories = await Category.findByPk(req.params.id);
      // Cambiar la visualización de la fecha con Moment.js
      const created = moment(categories.createdAt).format("LLLL");
      const updated = moment(categories.updatedAt).fromNow();

      res.render("category/updateCategory", {
        title: "Actualizar categoría | GloboFiestaCake's",
        authAdmin: "yes",
        auth,
        messages,
        created,
        updated,
        categories: categories,
      });
    }
  }
};
