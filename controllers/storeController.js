// Renderizar el formulario de la tienda
exports.formularioTiendaHome = (req, res, next) => {
  const { auth } = res.locals.usuario;
  res.render("store/store", {
    title: "Tienda | GloboFiestaCake's",
    authAdmin: "yes",
    auth,
  });
};
