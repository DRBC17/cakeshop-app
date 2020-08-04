// Importar los módulos necesarios
import Axios from "axios";
import Swal from "sweetalert2";

// Obtener el nombre del botón desde el DOM
const boton = document.getElementById("terminar-compra");

if (boton) {
  boton.addEventListener("click", (e) => {
    // Mostrar una alerta consultando
    Swal.fire({
      title: "¿Estás seguro que deseas realizar el pedido?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#56CC9D",
      cancelButtonColor: "#FF7851",
    }).then((result) => {
      if (result.value) {
        // Crear la URL de terminar compra
        const url = `${location.origin}/tienda/terminar_compra`;
        const address = document.getElementById("address").value;
        const atHome = document.getElementById("customCheck_domicilio").checked;
        if (!address) {
          Swal.fire("ERROR", "¡Debes ingresar tu dirección!", "error");
        } else {
          Axios.post(url, { address, atHome })
            .then((response) => {
              if (response.status === 200) {
                Swal.fire(
                  "¡Se realizo el pedido!",
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
              Swal.fire(
                "ERROR",
                "!Ha ocurrido un error al momento de realizar el pedido¡",
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
