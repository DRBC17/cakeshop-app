// Importamos los modulos a utilizar
const Sequelize = require("sequelize");
const db = require("../config/db");
// Constante para obtener fecha
const now = new Date();

//Modelo de imagen del Producto
const ImageProduct = db.define(
    "imageProduct",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fileName: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        path: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        originalName: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        nimeType: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        size: {
            type: Sequelize.INTEGER,
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
            beforeCreate(imageProduct) {
                // Definimos la fecha de creación y modificación como fecha actual
                imageProduct.createAt = now;
                imageProduct.updatedAt = now;
            },
            beforeUpdate(imageProduct) {
                //Cuando se realizan cambios en el modelo se actualiza la fecha
                imageProduct.updatedAt = now;
            },
        },
    }
);

module.exports = ImageProduct;
