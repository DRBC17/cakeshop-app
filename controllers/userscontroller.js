// Importamos el modelo para usuarios
const User = require("../models/user");

exports.formularioCrearCuenta = async (req, res, next) => {
  res.render("user/register");
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
  const mensajes = [];

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
      res.send("Creado");
      // Redireccionar el usuario al formulario de inicio de sesión
      //   res.redirect("iniciar_sesion");
    } catch (error) {
      mensajes.push({
        error,
        type: "alert-danger",
      });
      res.render("user/register", { mensajes });
    }
  } else {
    mensajes.push({
        error: "Las contraseñas deben coincidir.",
        type: "alert-danger",
      });
    res.render("user/register", { mensajes });
  }
};
