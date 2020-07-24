import axios from "axios";

// Seleccionar desde el DOM el objeto que contiene los pedidos
const pedidos = document.querySelector("#listado-pedidos");

// Verificar si existe el objeto en el sDOM
if (pedidos) {
  // Agregar un evento click sobre los input de cada pedido
  pedidos.addEventListener("click", (e) => {
    // Actualizar el estado de el producto
    if (e.target.classList.contains("custom-control-label")) {
      const icono = e.target;
      const idPedido = icono.parentElement.dataset.pedido;

      // Crear la ruta hacia el endpoint que actualiza el estado del pedido
      const url = `${location.origin}/pedido/${idPedido}`;
      axios.patch(url, { idPedido }).then(function (response) {
        if (response.status == 200) {
          // Buscamos el label y el cb
          const cb = document.getElementById(`customSwitch_${idPedido}`);
          const label = document.getElementById(`label_${idPedido}`);

          // Si esta seleccionado cambiamos el nombre
          if (cb.checked) {
            label.innerHTML = "Entregado";
          } else {
            label.innerHTML = "Pendiente";
          }
        }
      });
    }
  });
}

export default pedidos;
