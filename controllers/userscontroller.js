// Importamos el modelo para usuarios
const User = require("../models/user");
// Importamos bcrypt-nodejs
const bcrypt = require("bcrypt-nodejs");
// Importar slug
const slug = require("slug");
// Requerimos las variables de entorno
require("dotenv").config();

// Renderizamos el formulario para las políticas
exports.formularioPoliticas = (req, res, next) => {
  res.render("user/cookiePolicies", {
    title: "Políticas de cookies | GloboFiestaCake's",
  });
};

// Renderizamos el formulario para crear cuenta
exports.formularioCrearCuenta = (req, res, next) => {
  res.render("user/register", { title: "Regístrate en GloboFiestaCake's" });
};

// Creamos una cuenta
exports.CrearCuenta = async (req, res, next) => {
  // Obtenemos por destructuring los datos
  const usuario = req.body;
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    phone,
  } = usuario;
  console.log(usuario);

  let messages = "";
  if (validarContraseña(password)) {
    // En caso que las contraseñas no cumpla con los requisitos
    messages = {
      error:
        "La contraseña debe tener como mínimo 4 caracteres de longitud y tener al menos una letra mayúscula",
    };
    res.render("user/register", {
      title: "Regístrate en GloboFiestaCake's",
      usuario,
      messages,
    });
    // si las contraseñas son iguales creara la cuenta
  } else if (password === passwordConfirm) {
    // Intentar crear el usuario
    try {
      //Crear el usuario
      await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
      });

      // Redireccionar el usuario al formulario de inicio de sesión
      res.redirect("iniciar_sesion");
    } catch (error) {
      // Mensaje personalizado sobre si un correo ya existe
      if (error["name"] === "SequelizeUniqueConstraintError") {
        messages = {
          error:
            "¡Ya existe un usuario registrado con esta dirección de correo!",
        };
      } else {
        messages = { error };
      }

      res.render("user/register", {
        title: "Regístrate en GloboFiestaCake's",
        usuario,
        messages,
      });
    }
  } else {
    // En caso que las contraseñas no sean iguales mandamos el siguiente mensaje
    messages = { error: "¡Las contraseñas deben coincidir!" };
    res.render("user/register", {
      title: "Regístrate en GloboFiestaCake's",
      usuario,
      messages,
    });
  }
};
// Renderizamos el formulario de iniciar sesión
exports.formularioIniciarSesion = (req, res, next) => {
  // Verificar si existe algún mensaje
  const messages = res.locals.messages;

  res.render("user/login", {
    title: "Iniciar sesión en GloboFiestaCake's",
    messages,
  });
};

function authAdmin(res, auth, usuario, messages) {
  // Si auth es positivo mostrara las opciones de admin
  if (auth === 2) {
    res.render("user/adminAccount", {
      title: "Administrador | GloboFiestaCake's",
      usuario,
      auth,
      messages,
    });
  } else {
    res.render("user/account", {
      title: "Mi cuenta | GloboFiestaCake's",
      usuario,
      auth,
      messages,
    });
  }
}

// Renderizamos el formulario para la cuenta
exports.formularioCuenta = async (req, res, next) => {
  // Obtenemos el id del usuario actual
  const { id, auth } = res.locals.usuario;
  // Buscamos los datos actualizados del usuario
  const usuario = await User.findByPk(id);
  const messages = [];
  // Verificamos si el usuario es administrador
  // Si auth es positivo mostrara las opciones de administrador
  authAdmin(res, auth, usuario, messages);
};

// Actualizar los datos de un usuario
exports.actualizarUsuario = async (req, res, next) => {
  // Obtener la información enviada
  const { firstName, lastName, email, phone, password } = req.body;

  // Obtener la información del usuario actual
  const { id, auth } = res.locals.usuario;

  let messages = [];

  // Verificar el nombre
  if (!firstName) {
    messages.push({
      error: "¡Debe ingresar un nombre!",
      type: "alert-danger",
    });
  }

  // Verificar el Apellido
  if (!lastName) {
    messages.push({
      error: "¡Debe ingresar un apellido!",
      type: "alert-danger",
    });
  }

  // Verificar el teléfono
  if (!phone) {
    messages.push({
      error: "¡Debe ingresar un numero de teléfono!",
      type: "alert-danger",
    });
  }

  // Si la contraseña enviada no es igual a la que esta almacenada no permitirá al programa modificar los datos
  if (verificarContraseña(res, password) === false) {
    messages.push({
      error: "¡Para actualizar datos debe ingresar su contraseña!",
      type: "alert-danger",
    });
  }
  // Si hay mensajes
  if (messages.length) {
    // Enviar valores correctos si la actualización falla
    const usuario = await User.findByPk(id);

    // Si auth es positivo mostrara las opciones de admin
    authAdmin(res, auth, usuario, messages);
  } else {
    // No existen errores ni mensajes
    // Actualizamos los datos del usuario
    await User.update(
      { firstName, lastName, email, phone },
      {
        where: {
          id,
        },
      }
    );
    // si se cumplió todo enviamos el siguiente mensaje
    messages.push({
      error: "¡Usuario actualizado exitosamente!",
      type: "alert-success",
    });

    // cargamos los nuevos datos del usuario
    const usuario = await User.findByPk(id);
    // Verificamos si es administrador y enviamos los nuevos datos
    authAdmin(res, auth, usuario, messages);
  }
};

// Verifica qie la contraseña enviada sea igual que la contraseña que esta en el sistema
function verificarContraseña(res, password) {
  // Si el usuario existe, verificar si su contraseña es correcta
  const passwordOld = res.locals.usuario.password;
  // Regresara un True si las contraseñas son iguales
  return bcrypt.compareSync(password, passwordOld);
}

function validarContraseña(contraseña) {
  const verificar = slug(contraseña).toLowerCase();
  if (contraseña.length >= 4 && contraseña != verificar) {
    return false;
  } else {
    return true;
  }
}
