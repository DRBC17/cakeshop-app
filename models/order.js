// Importamos los módulos a utilizar
const Sequelize = require("sequelize");
//importamos la base de datos.
const db = require("../config/db");
// Constante para obtener fecha
const now = new Date();

//Modelo de orden
const Order = db.define("order", {
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
        msg: "¡Debe ingresar una dirección!",
      },
    },
  },
  phone: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "¡Debe ingresar un numero de teléfono!",
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
});

module.exports = Order;
