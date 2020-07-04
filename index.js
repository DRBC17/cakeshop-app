const express = require("express");
const path = require("path");
// Importar morgan para mostrar el trafico que hay en el servidor
const morgan = require("morgan");
// Importar body-parser para manejar los datos que hay en body
const bodyParser = require("body-parser");
// Importar passport para permitir el inicio de sesión
const passport = require("./config/passport");
// Importar express-session para manejar las sesiones de usuario
const session = require("express-session");
// Importar cookie-parser para habilitar el manejo de cookies en el sitio
const cookieParser = require("cookie-parser");
// Importar connect-flash para disponer de los errores en todo el sitio
const flash = require("connect-flash");
// Importar multer para facilitar el manejo de imágenes
const multer = require("multer");
// Importar shortid
const shortid = require("shortid");
//handlebars
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
//End handlebars
require("dotenv").config();

const router = require("./routers/index.router");

// Crear la conexión con la base de datos
const db = require("./config/db");

// Importar modelos
require('./models/user');
require('./models/category');
require('./models/imageProduct');
require('./models/order');
require('./models/orderDetail');
require('./models/product');

//Realizar  Conexion a la base de datos
db.sync()
  .then(() => console.log("Conectado con el servidor de BD"))
  .catch((error) => console.log(error));

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
app.use(morgan("dev"));

// Configuracion de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Habilitar el uso de cookieParser
app.use(cookieParser());

// Habilitar las sesiones de usuario
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Habilitar el uso de connect-flash para compartir mensajes
app.use(flash());

// Crear una instancia de passport y cargar nuestra estrategia
app.use(passport.initialize());
app.use(passport.session());

// Pasar algunos valores mediante middleware
app.use((req, res, next) => {
  // Pasar el usuario a las variables locales de la petición
  res.locals.usuario = { ...req.user } || null;
  res.locals.messages = req.flash();
  // Continuar con el camino del middleware
  next();
});
// Definimos los parámetros para multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/img/uploads"),
  filename: (req, file, cb, filename) => {
    cb(null, shortid.generate() + path.extname(file.originalname));
  },
});
// Mandamos los parámetros antes definidos y configuramos para solo enviar de 1 en 1 imagen
app.use(multer({ storage }).single("image"));

// >Routes

app.use("/", router());
// >Static files

// Configuracion de la carpeta publica
app.use(express.static(path.join(__dirname, "public")));

// >Global variable

// Inizialiazar el server
app.listen(app.get("port"), () => {
  console.log(`Server started on port ${app.get("port")}`);
});
