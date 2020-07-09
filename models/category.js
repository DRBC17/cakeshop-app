// Importamos los módulos a utilizar
const Sequelize = require("sequelize");
//importamos la base de datos.
const db = require("../config/db");
// Importar slug
const slug = require("slug");
// Importar shortid
const shortid = require("shortid");
// Constante para obtener fecha
const now = new Date();
const Product = require("./product");
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
        msg: "¡Ya existe una categoría registrada con ese nombre!",
      },
      validate: {
        notEmpty: {
          msg: "¡Debe ingresar un nombre para la categoría!",
        },
      },
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "¡Debes ingresar una descripción!",
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
        // Convertimos en minúscula la url y le adjuntamos un código generado con shortid
        const url = slug(category.name).toLowerCase();
        category.url = `${url}_${shortid.generate()}`;

        // Convierte el nombre al formato camelCase
        const name = category.name.camelCase();
        category.name = name;
      },
    },
  }
);
// Definir que una categoría puede tener muchos productos
Category.hasMany(Product);

// Métodos personalizados
String.prototype.camelCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = Category;
