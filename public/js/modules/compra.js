// Importar los módulos necesarios
import Axios from "axios";
import Swal from "sweetalert2";
import { locale } from "moment";

// Obtener el nombre del botón desde el DOM
const boton = document.getElementById("terminar-compra");

if (boton) {
  boton.addEventListener("click", (e) => {
    // Mostrar una alerta consultando al usuario si quiere eliminar el elemento
    Swal.fire({
      title: "¿Estás seguro que deseas realizar el pedido?",
      // text: "¡Si eliminas este producto no lo puedes recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#56CC9D",
      cancelButtonColor: "#FF7851",
    }).then((result) => {
      if (result.value) {
        // Crear la URL de eliminación
        const url = `${location.origin}/tienda/terminar_compra`;
        const address = document.getElementById("address").value;
        if (!address) {
          Swal.fire("Error", "Debes ingresar una dirección", "error");
        } else {
          Axios.post(url, { address })
            .then((response) => {
              if (response.status === 200) {
                // Mostrar un mensaje de confirmación de eliminación
                Swal.fire(
                  "Se realizo el pedido",
                  response.data.message,
                  "success"
                );
                //   Redireccionar al carrito
                setTimeout(() => {
                  window.location.href = "/tienda";
                }, 2000);
              }
            })
            .catch((result) => {
              // Mostrar un mensaje de confirmación de eliminación
              Swal.fire(
                "Error",
                "Ha ocurrido un error al momento de realizar el pedido",
                "error"
              );
            });
        }
      }
    });
  });
}
// /tienda/terminar_compra
export default boton;
