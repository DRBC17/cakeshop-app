// Importamos el modelo para usuarios
const User = require("../models/user");

exports.formularioCrearCuenta = async (req, res, next) => {
  res.render("user/register", { title: "Regístrate en GloboFiestaCake's" });
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

  let messages = "";

  if (password === passwordConfirm) {
    // Intentar crear el usuario
    try {
      //Crear el usuario
      await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
      });

      // Redireccionar el usuario al formulario de inicio de sesión
      res.redirect("iniciar_sesion");
    } catch (error) {
      
      // Mensaje personalizado sobre si un correo ya existe
      if (error["name"] === "SequelizeUniqueConstraintError") {
        messages = {
          error: "Ya existe un usuario registrado con esta dirección de correo",
        };
      } else {
        messages = { error };
      }

      res.render("user/register", {
        title: "Regístrate en GloboFiestaCake's",
        messages,
      });
    }
  } else {
    messages = { error: "Las contraseñas deben coincidir." };
    res.render("user/register", {
      title: "Regístrate en GloboFiestaCake's",
      messages,
    });
  }
};

exports.formularioIniciarSesion = (req, res, next) => {
  // Verificar si existe algún mensaje
  const messages = res.locals.messages;

  res.render("user/login", {
    title: "Iniciar sesión en GloboFiestaCake's",
    messages,
  });
};

exports.formularioCuenta = (req, res, next) => {
  res.render("user/account", {
    title: "GloboFiestaCake's",
    auth: "yes",
  });
};
