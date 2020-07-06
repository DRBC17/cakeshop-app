// Renderizar el formulario de la tienda 
exports.formularioTiendaHome = (req, res, next) => {
  res.render("store/home", {
    title: "Bienvenido a GloboFiestaCake's",
    authAdmin: "yes",
  });
};
