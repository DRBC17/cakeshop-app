// Importar los módulos necesarios
import Axios from "axios";
import Swal from "sweetalert2";
const botonContraseña = document.getElementById("cambiar_password");
const botonEmail = document.getElementById("cambiar_email");

if (botonContraseña) {
  botonContraseña.addEventListener("click", async (e) => {
    const { value: formValues } = await Swal.fire({
      title: "Cambiar contraseña",
      html:
        '<input id="swal-input1" type="password" class="swal2-input" placeholder="Contraseña actual">' +
        '<input id="swal-input2" type="password" class="swal2-input" placeholder="Nueva contraseña">',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#56CC9D",
      cancelButtonColor: "#FF7851",
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    });

    if (formValues) {
      if (formValues[0] === "" && formValues[1] === "") {
        Swal.fire("Error", "Debe rellenar todos los datos", "error");
      } else if (formValues[0] === "") {
        Swal.fire("Error", "Debe ingresar su contraseña actual", "error");
      } else if (formValues[0] === "") {
        Swal.fire("Error", "Debe ingresar la nueva contraseña", "error");
      } else {
        const url = `${location.origin}/cuenta/cambiar_password`;
        Axios.post(url, { password: formValues[0], passwordNew: formValues[1] })
          .then((response) => {
            // Swal.fire(JSON.stringify())
            if (response["data"].error === "contraseña incorrecta") {
              Swal.fire("Error", "La contraseña actual es incorrecta", "error");
            } else if (response["data"].error === "contraseña no valida") {
              Swal.fire(
                "Error",
                "¡La contraseña debe tener como mínimo 4 caracteres de longitud y tener al menos una letra mayúscula!",
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
    }
  });
}

if (botonEmail) {
  botonEmail.addEventListener("click", async (e) => {
    const { value: email } = await Swal.fire({
      title: "Cambiar correo electrónico",
      input: "email",
      validationMessage: "Dirección de correo electrónico invalida",
      inputPlaceholder: "Nuevo correo electrónico",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#56CC9D",
      cancelButtonColor: "#FF7851",
      focusConfirm: false,
    });

    if (email) {
      const url = `${location.origin}/cuenta/cambiar_email`;
      Axios.post(url, { email })
        .then((response) => {
          if (response.status === 200) {
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
            "Ha ocurrido un error al momento de actualizar el correo electrónico",
            "error"
          );
        });
    }
  });
}
