// Importamos los módulos a utilizar
const Sequelize = require("sequelize");
//importamos la base de datos.
const db = require("../config/db");
// Importar slug
const slug = require("slug");
// Importar shortid
const shortid = require("shortid");
const Category = require("./category");
// Constante para obtener fecha
const now = new Date();

//Modelo de producto
const Product = db.define(
  "product",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "¡Debe seleccionar una categoría!",
        },
      },
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "¡Debe ingresar un nombre para el producto!",
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
    imageId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "¡Debe seleccionar una imagen!",
        },
      },
    },
    unitPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "¡Debe ingresar precio para el producto!",
        },
      },
    },
    available: {
      type: Sequelize.BOOLEAN,
      defaultValue: 1,
    },
    urlImage: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate(product) {
        // Convertimos en minúscula la url y le adjuntamos un código generado con shortid
        const url = slug(product.name).toLowerCase();
        product.url = `${url}_${shortid.generate()}`;

        // Convierte el nombre al formato camelCase
        const name = product.name.camelCase();
        product.name = name;
        // Convierte la descripción al formato camelCase
        const description = product.description.camelCase();
        product.description = description;
      },
    },
  }
);
// Definir que una categoría puede tener muchos productos
Product.belongsTo(Category);

// Métodos personalizados
String.prototype.camelCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = Product;
