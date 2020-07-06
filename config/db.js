// Importamos el modulo sequelize
const Sequelize = require("sequelize");
// Requerimos las variables de entorno
require("dotenv").config();

// Parámetros de la conexión a la base de datos
const db = new Sequelize(
  "cakeshop",
  process.env.MYSQLUSER,
  process.env.MYSQLPASS,
  {
    host: "localhost",
    dialect: "mysql",
    port: process.env.MYSQLPORT,
    operatorAliases: false,
    define: {
      timestamps: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = db;
