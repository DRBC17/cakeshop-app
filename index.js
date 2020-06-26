const express = require("express");
const path = require('path');
//handlebars
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
//End handlebars


const app = express();

// >Settings

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

// >Routes

// >Static files

// >Global variable

// Inizialiazar el server
app.listen(port, () => {
  console.log(`Server started on port`);
});
