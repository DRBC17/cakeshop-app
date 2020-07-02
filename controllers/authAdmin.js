// Importamos el modelo para usuarios
const User = require("../models/user");

exports.adminAutenticado = async (req, res, next) => {
  const { id } = res.locals.usuario;
  const usuario = await User.findByPk(id);
  const { auth } = usuario;
  if (auth) {
    return next();
  }

  // Si el usuario no está autenticado, iniciar sesión
  return res.redirect("/");
};
