// Importamos el modelo para usuarios
const User = require("../models/user");

exports.formularioCrearCuenta = async (req, res, next) => {
  res.render("user/register", { title: "Regístrate en GloboFiestaCake's" });
};

exports.CrearCuenta = async (req, res, next) => {
  // Obtenemos por destructuring los datos
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    phone,
  } = req.body;

  let messages = "";

  if (password === passwordConfirm) {
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
          error: "Ya existe un usuario registrado con esta dirección de correo",
        };
      } else {
        messages = { error };
      }

      res.render("user/register", {
        title: "Regístrate en GloboFiestaCake's",
        messages,
      });
    }
  } else {
    messages = { error: "Las contraseñas deben coincidir." };
    res.render("user/register", {
      title: "Regístrate en GloboFiestaCake's",
      messages,
    });
  }
};

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
  if (auth) {
    res.render("user/adminAccount", {
      title: "Administrador | GloboFiestaCake's",
      usuario,
      authAdmin: "yes",
      messages,
    });
  } else {
    res.render("user/account", {
      title: "Mi cuenta | GloboFiestaCake's",
      usuario,
      authAdmin: "yes",
      messages,
    });
  }
}

exports.formularioCuenta = async (req, res, next) => {
  // Obtener el usuario actual
  const { id } = res.locals.usuario;
  const usuario = await User.findByPk(id);
  const { auth } = usuario;
  const messages = [];

  console.log(usuario);

  // Si auth es positivo mostrara las opciones de admin
  authAdmin(res, auth, usuario, messages);
};

// Actualizar los datos de un usuario
exports.actualizarUsuario = async (req, res, next) => {
  // Obtener la información enviada
  const { firstName, lastName, email, phone } = req.body;

  // Obtener la información del usuario actual
  const { id, auth } = res.locals.usuario;

  const messages = [];

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

  // Verificar el correo electrónico
  if (!email) {
    messages.push({
      error: "¡Debe ingresar un correo electrónico!",
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

  // Si hay mensajes
  if (messages.length) {
    // Enviar valores correctos si la actualización falla
    const usuario = await User.findByPk(id);

    // Si auth es positivo mostrara las opciones de admin
    authAdmin(res, auth, usuario, messages);
  } else {
    // No existen errores ni mensajes
    await User.update(
      { firstName, lastName, email, phone },
      {
        where: {
          id,
        },
      }
    );

    messages.push({
      error: "¡Usuario actualizado exitosamente!",
      type: "alert-success",
    });

    const usuario = await User.findByPk(id);
    // Si auth es positivo mostrara las opciones de admin
    authAdmin(res, auth, usuario, messages);
  }
};
