// Renderizar el formulario de inicio
exports.formularioHome = (req, res, next) => {
  const { auth } = res.locals.usuario;
  res.render("home", {
    title: "Bienvenido a GloboFiestaCake's",
    auth,
  });
};
