module.exports = {
  //Helper para comparar dos valores
  compare: (value1, value2, options) => {
    if (arguments.length < 3)
      throw new Error("Handlebars Helper compare necesita 2 parámetros.");
      if (value1 === value2) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
  },
};
