const Category = require("../models/category");

exports.formularioCategorias = (req, res, next) => {
  res.render("category/categories", {
    title: "Categorías | GloboFiestaCake's",
    authAdmin: "yes",
  });
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

  let messages = "";

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
      title: "Agregar categoria | GloboFiestaCake's",
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

      res.render("category/categories", {
        title: "Categorias | GloboFiestaCake's",
        authAdmin: "yes",
        messages,
      });
    }
  }
};
