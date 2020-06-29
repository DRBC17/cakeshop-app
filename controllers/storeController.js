exports.formularioTiendaHome = async (req, res, next) => {
  res.render("store/home", {
    title: "Bienvenido a GloboFiestaCake's",
    auth: "yes",
  });
};
