// Importamos los modulos a utilizar
const Sequelize = require("sequelize");
const db = require("../config/db");
// Constante para obtener fecha
const now = new Date();

//Modelo de detalle de las ordenes
const OrderDetail = db.define(
  "orderDetail",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ordeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
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
      beforeCreate(orderDetail) {
        // Definimos la fecha de creación y modificación como fecha actual
        orderDetail.createAt = now;
        orderDetail.updatedAt = now;
      },
      beforeUpdate(orderDetail) {
        //Cundo se realizan cambios en el modelo se actualiza la fecha
        orderDetail.updatedAt = now;
      },
    },
  }
);

module.exports = OrderDetail;
