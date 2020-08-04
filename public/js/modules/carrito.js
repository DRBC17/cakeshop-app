import axios from "axios";
import Swal from "sweetalert2";
import Axios from "axios";
// Seleccionar desde el DOM el objeto que contiene las compras
const compras = document.querySelector("#listado-compras");

// Verificar si existe el objeto en el DOM
if (compras) {
  // Agregar un evento click sobre los i de cada elemento
  compras.addEventListener("click", (e) => {
    // Si realizo click sobre la papelera de eliminación (fa-times)
    if (e.target.classList.contains("fa-trash")) {
      // Necesitamos obtener el elemento
      const eCompra = e.target;
      const idCompra = eCompra.parentElement.parentElement.dataset.compra;

      // Mostrar una alerta consultando al usuario si quiere eliminar el elemento
      Swal.fire({
        title: "¿Estás seguro que deseas borrar este producto de tu lista?",
        text: "¡Si eliminas este producto no lo puedes recuperar!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#56CC9D",
        cancelButtonColor: "#FF7851",
      }).then((result) => {
        if (result.value) {
          // Crear la URL de eliminación
          const url = `${location.origin}/tienda/eliminar_del_carrito/${idCompra}`;
          console.log(url);
          Axios.delete(url, { params: { id: idCompra } })
            .then((response) => {
              if (response.status === 200) {
                // Mostrar un mensaje de confirmación de eliminación
                Swal.fire(
                  "¡Producto eliminado de la lista!",
                  response.data.message,
                  "success"
                );
                //   Redireccionar al carrito
                setTimeout(() => {
                  window.location.href = "/tienda/carrito";
                }, 3000);
              }
            })
            .catch((result) => {
              // Mostrar un mensaje de confirmación de eliminación
              Swal.fire(
                "ERROR",
                "¡Ha ocurrido un error al momento de eliminar el producto!",
                "error"
              );
            });
        }
      });
    }
  });
}

export default compras;
