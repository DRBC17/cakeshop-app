// Importamos los modulos a utilizar
const Sequelize = require("sequelize");
const db = require("../config/db");
// Importar slug
const slug = require("slug");
// Importar shortid
const shortid = require("shortid");
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
      unique: {
        args: true,
        msg: "Ya existe una categoría registrada con ese nombre",
      },
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
    url: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate(category) {
        console.log("Antes de insertar en la base de datos");
        const url = slug(category.name).toLowerCase();

        category.url = `${url}_${shortid.generate()}`;
      },
      beforeUpdate(category) {
        const url = slug(category.name).toLowerCase();

        category.url = `${url}_${shortid.generate()}`;
      },
    },
  }
);

module.exports = Category;
