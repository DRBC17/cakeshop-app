// Importamos los modulos a utilizar
const Sequelize = require("sequelize");
const db = require("../config/db");
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
          msg: "Debe seleccionar una categoría",
        },
      },
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
    imageId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Debe seleccionar una imagen",
        },
      },
    },
    unitPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Debe ingresar un nombre para la categoría",
        },
      },
    },
    available: {
      type: Sequelize.BOOLEAN,
      defaultValue: 1,
    },
    url: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate(product) {
        const url = slug(product.name).toLowerCase();

        product.url = `${url}_${shortid.generate()}`;
      },
      beforeUpdate(product) {
        const url = slug(product.name).toLowerCase();

        product.url = `${url}_${shortid.generate()}`;
      },
    },
  }
);

module.exports = Product;
