// Importamos los modulos a utilizar
const Sequelize = require("sequelize");
const db = require("../config/db");
// Constante para obtener fecha
const now = new Date();

//Modelo de categoría
const Category = db.define("category", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "Debe ingresar un nombre para la categoría",
      },
    },
  },
  description: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Debes ingresar una descripción",
      },
    },
  },
});

module.exports = Category;
