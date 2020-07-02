const Category = require("../models/category");

// Importar Moment.js
const moment = require("moment");
moment.locale("es");

exports.formularioCategorias = async (req, res, next) => {
  let categories = [];
  let messages = [];
  try {
    // Obtenemos las categorías creadas y lo mostramos con la fehca con tiempo
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
      messages,
      categories: categories,
    });
  }
};

exports.formularioCrearCategoria = (req, res, next) => {
  res.render("category/addCategory", {
    title: "Agregar categoría | GloboFiestaCake's",
    authAdmin: "yes",
  });
};
exports.CrearCategoria = async (req, res, next) => {
  // Obtenemos por destructuring los datos
  const { name, description } = req.body;

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
          error: "Ya existe una categoría registrada con ese nombre",
        };
      } else {
        messages = { error };
      }

      res.render("category/addCategory", {
        title: "Agregar categoría | GloboFiestaCake's",
        authAdmin: "yes",
        messages,
      });
    }
  }
};

// Busca un categoría por su URL
exports.obtenerCategoriaPorUrl = async (req, res, next) => {
  try {
    // Obtener la categoría mediante la URL
    const categories = await Category.findOne({
      where: {
        url: req.params.url,
      },
    });

    // Cambiar la visualización de la fecha con Moment.js
    const created = moment(categories["dataValues"].createdAt).format("LLLL");
    const updated = moment(categories["dataValues"].updatedAt).fromNow();

    res.render("category/updateCategory", {
      title: "Categorías | GloboFiestaCake's",
      authAdmin: "yes",
      created,
      updated,
      categories: categories,
    });
  } catch (error) {
    res.send(error);
    res.redirect("/categorias");
  }
};

// Actualizar los datos de una categoría
exports.actualizarCategoria = async (req, res, next) => {
  // Obtener la información enviada
  const { name, description } = req.body;

  const mensajes = [];

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
  if (mensajes.length) {
    // Enviar valores correctos si la actualización falla
    categories = await Category.findByPk(req.params.id);
    // Cambiar la visualización de la fecha con Moment.js
    const created = moment(categories.createdAt).format("LLLL");
    const updated = moment(categories.updatedAt).fromNow();

    res.render("updateCategory", {
      title: "Actualizar categoría | GloboFiestaCake's",
      authAdmin: "yes",
      messages,
      created,
      updated,
      categories: categories,
    });
  } else {
    // No existen errores ni mensajes
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
  }
};
