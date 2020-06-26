const express = require('express');
const path = require("path");
const morgan = require('morgan');
const bodyParser = require('body-parser');
//handlebars
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
//End handlebars
require('dotenv').config();

const router = require('./routers/index.router');

const app = express();

// >Settings

app.set("port", process.env.SERVERPORT || 3000);
app.set("views", path.join(__dirname, "views"));

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.set("view engine", ".hbs");

// >Middleware

// Configuracion de morgan
app.use(morgan('dev'));
// Configuracion de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// >Routes

app.use('/',router());
// >Static files

// Configuracion de la carpeta publica
app.use(express.static(path.join(__dirname, "public")));

// >Global variable

// Inizialiazar el server
app.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);
});
