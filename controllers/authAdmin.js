// Importamos el modelo para usuarios
const User = require("../models/user");

exports.adminAutenticado = async (req, res, next) => {
  // buscamos el id del usuario actual.
  const { id } = res.locals.usuario;
  // buscamos los datos del usuario actual por medio del id.
  const usuario = await User.findByPk(id);
  // extraemos auth, que contiene un true si el usuario es administrador.
  const { auth } = usuario;
  // Verificamos si es administrador.
  if (auth) {
    // En caso de ser administrador lo dejamos continuar.
    return next();
  }

  // Si el usuario no administrador lo regresamos al inicio.
  return res.redirect("/");
};
