// Importamos los modulos a utilizar
const Sequelize = require("sequelize");
const db = require("../config/db");
const bcrypt = require("bcrypt-nodejs");
const { DATE } = require("sequelize");

//Modelo de usuario
const User = db.define(
    "user",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Debes ingresar su nombre",
          },
        },
      },
      lastName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Debes ingresar su apellido",
          },
        },
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: {
          args: true,
          msg: "Ya existe un usuario registrado con esta dirección de correo",
        },
        validate: {
          notEmpty: {
            msg: "Debes ingresar un correo electrónico",
          },
          isEmail: {
            msg: "Verifica que tu correo es un correo electrónico válido",
          },
        },
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Debes ingresar una contraseña",
          },
        },
      },
      phone: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Debes ingresar un numero de telefono",
          },
        },
      },
      auth: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createAt: {
        type: Sequelize.DATE,

      },
      updatedAt: {
        type: Sequelize.DATE,

      },
      token: Sequelize.STRING,
      expiration: Sequelize.DATE,

    },
    {
      hooks: {
        beforeCreate(usuario) {
          // Realizar el hash del password
          // https://www.npmjs.com/package/bcrypt
          usuario.password = bcrypt.hashSync(
            usuario.password,
            bcrypt.genSaltSync(13)
          );
         
          const now= new Date();
          usuario.createAt = now;
          usuario.updatedAt = now;
        },
      },
    }
  );