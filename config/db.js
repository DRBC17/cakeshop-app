// Importamos el modulo sequelize
const Sequelize = require("sequelize");
require("dotenv").config({ path: "variables.env" });

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
      timestamps: false,
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