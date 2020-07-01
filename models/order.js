// Importamos los modulos a utilizar
const Sequelize = require("sequelize");
const db = require("../config/db");
// Constante para obtener fecha
const now = new Date();

//Modelo de orden
const Order = db.define(
  "order",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Debe ingresar una dirección",
        },
      },
    },
    phone: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Debe ingresar un numero de teléfono",
        },
      },
    },
    discount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },

    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    createAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate(order) {
        // Definimos la fecha de creación y modificación como fecha actual
        order.createAt = now;
        order.updatedAt = now;
      },
      beforeUpdate(order) {
        //Cundo se realizan cambios en el modelo se actualiza la fecha
        order.updatedAt = now;
      },
    },
  }
);

module.exports = Order;
