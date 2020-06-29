// Importamos los modulos a utilizar
const Sequelize = require("sequelize");
const db = require("../config/db");
// Constante para obtener fecha
const now = new Date();

//Modelo de categoría
const Category = db.define(
  "category",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
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
    createAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    hooks: {
      beforeCreate(category) {
        // Definimos la fecha de creación y modificación como fecha actual
        category.createAt = now;
        category.updatedAt = now;
      },
      beforeUpdate(category) {
        //Cundo se realizan cambios en el usuario se actualiza la fecha
        category.updatedAt = now;
      },
    },
  }
);

module.exports = Category;
