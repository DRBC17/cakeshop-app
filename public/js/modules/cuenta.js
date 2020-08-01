// Importar los módulos necesarios
import Axios from "axios";
import Swal from "sweetalert2";
import slug from "slug";
const botonContraseña = document.getElementById("cambiar_password");
const botonEmail = document.getElementById("cambiar_email");

if (botonContraseña) {
  botonContraseña.addEventListener("click", async (e) => {
    Swal.mixin({
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#56CC9D",
      cancelButtonColor: "#FF7851",
      focusConfirm: false,
      progressSteps: ["1", "2", "3"],
    })
      .queue([
        {
          title: "Cambiar contraseña",
          text: "Si desea actualizar su contraseña presione siguiente",
          icon: "warning",
          confirmButtonText: "Siguiente &rarr;",
        },
        {
          title: "Contraseña actual",
          input: "password",
          confirmButtonText: "Siguiente &rarr;",
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value) {
                resolve();
              } else {
                resolve("Debe ingresar su contraseña actual");
              }
            });
          },
        },
        {
          title: "Nueva contraseña",
          input: "password",
          confirmButtonText: "Actualizar",
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (!value) {
                resolve("Debe ingresar la nueva contraseña");
              } else {
                const verificar = slug(value).toLowerCase();
                if (value.length >= 4 && value != verificar) {
                  resolve();
                } else {
                  resolve(
                    "Debe tener como mínimo 4 caracteres de longitud y tener al menos una letra mayúscula"
                  );
                }
              }
            });
          },
        },
      ])
      .then((result) => {
        if (result.value) {
          const url = `${location.origin}/cuenta/cambiar_password`;
          Axios.post(url, {
            password: result.value[1],
            passwordNew: result.value[2],
          })
            .then((response) => {
              // Swal.fire(JSON.stringify())
              if (response["data"].error === "contraseña incorrecta") {
                Swal.fire(
                  "Error",
                  "La contraseña actual es incorrecta",
                  "error"
                );
              } else if (response.status === 200) {
                Swal.fire(
                  "Se actualizo la contraseña",
                  response.data.message,
                  "success"
                );
                //   Redireccionar al carrito
                setTimeout(() => {
                  window.location.href = "/cerrar_sesion";
                }, 2000);
              }
            })
            .catch((result) => {
              Swal.fire(
                "Error",
                "Ha ocurrido un error al momento de actualizar la contraseña",
                "error"
              );
            });
        }
      });
  });
}

if (botonEmail) {
  botonEmail.addEventListener("click", async (e) => {
    Swal.mixin({
      title: "Cambiar correo electrónico",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#56CC9D",
      cancelButtonColor: "#FF7851",
      focusConfirm: false,
      progressSteps: ["1", "2", "3"],
    })
      .queue([
        {
          title: "Cambiar correo electrónico",
          text: "Si desea actualizar su correo electrónico presione siguiente",
          icon: "warning",
          confirmButtonText: "Siguiente &rarr;",
        },
        {
          title: "Contraseña actual",
          input: "password",
          confirmButtonText: "Siguiente &rarr;",
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value) {
                resolve();
              } else {
                resolve("Debe ingresar su contraseña actual");
              }
            });
          },
        },
        {
          title: "Correo electrónico nuevo",
          input: "email",
          validationMessage: "Dirección de correo electrónico invalida",
          confirmButtonText: "Actualizar",
        },
      ])
      .then((result) => {
        if (result.value) {
          // console.log(result.value[0]);
          const url = `${location.origin}/cuenta/cambiar_email`;
          Axios.post(url, { password: result.value[1], email: result.value[2] })
            .then((response) => {
              if (response["data"].error === "contraseña incorrecta") {
                Swal.fire(
                  "Error",
                  "La contraseña actual es incorrecta",
                  "error"
                );
              } else if (response.status === 200) {
                Swal.fire(
                  "Se actualizo el correo electrónico",
                  response.data.message,
                  "success"
                );
                //   Redireccionar al carrito
                setTimeout(() => {
                  window.location.href = "/cerrar_sesion";
                }, 2000);
              }
            })
            .catch((result) => {
              Swal.fire(
                "Error",
                "Ha ocurrido un error al momento de actualizar el correo electrónico",
                "error"
              );
            });
        }
      });
  });
}
