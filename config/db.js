// Importamos el modulo sequelize
const Sequelize = require("sequelize");
// Requerimos las variables de entorno
require("dotenv").config();

// Parámetros de la conexión a la base de datos
const db = new Sequelize(
  process.env.MYSQLDB,
  process.env.MYSQLUSER,
  process.env.MYSQLPASS,
  {
    host: process.env.MYSQLSERVER,
    dialect: "mysql",
    port: process.env.MYSQLPORT,
    operatorAliases: false,
    define: {
      timestamps: true,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = db;
