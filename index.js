const express = require("express");
// Importar path
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
// Handlebars
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
// End handlebars
// Importamos las variables de entorno
require("dotenv").config();
// Importamos las rutas
const router = require("./routers/index.router");
// Crear la conexión con la base de datos
const db = require("./config/db");
// Importar helpers con funciones comunes para todo el sitio
const helpers = require("./helpers");

// Importamos los modelos modelos
require("./models/user");
require("./models/category");
require("./models/imageProduct");
require("./models/order");
require("./models/orderDetail");
require("./models/product");

//Realizamos la conexión con la base de datos
db.sync()
  .then(() => console.log("Conectado con el servidor de BD"))
  .catch((error) => console.log(error));

const app = express();

// >Settings
// Configuramos el puerto para el servidor
app.set("port", process.env.PORT || 3000);
app.set("host", process.env.HOST || "0.0.0.0");
// Configuramos la ruta de las vistas
app.set("views", path.join(__dirname, "views"));
// Configuramos el motor de vista Handlebars
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    // Definimos la carpeta layout
    layoutsDir: path.join(app.get("views"), "layouts"),
    // Definimos la carpeta partials
    partialsDir: path.join(app.get("views"), "partials"),
    // Definimos la carpeta de los helpers
    helpers: require("./helpers/handlebars"),
    // Definimos la extension del motor
    extname: ".hbs",
    // Prevenimos el error recomendado por Handlebars
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
// Definimos que el motor de vistas es Handlebars
app.set("view engine", ".hbs");

// >Middleware

// Configuracion de morgan para mostrar el trafico en el servidor
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
  // Pasar valores de variables por el helper
  res.locals.vardump = helpers.vardump;
  // Continuar con el camino del middleware
  next();
});
// Definimos los parámetros para multer
const storage = multer.diskStorage({
  // Definimos donde se van a guardar las imagenes
  destination: path.join(__dirname, "public/img/uploads"),
  filename: (req, file, cb, filename) => {
    // Configuramos que las imágenes se guarden con un código generado por shortId
    cb(null, shortid.generate() + path.extname(file.originalname));
  },
});
// Mandamos los parámetros antes definidos y configuramos que recibirá del input llamado image
app.use(multer({ storage }).single("image"));

// >Static files

// Configuración de la carpeta publica
app.use(express.static(path.join(__dirname, "public")));

// >Routes
// Mandamos a llamar las rutas
app.use("/", router());

app.use(function (req, res, next) {
  res
    .status(404)
    .render("information/notFound", {
      title: "Pagina no encontrada | GloboFiestaCake's",
    });
});

// >Global variable

// Inizialiazar el server
app.listen(app.get("port"), app.get("host"), () => {
  console.log(`Server started on port ${app.get("port")}`);
});
