import axios from "axios";

// Seleccionar desde el DOM el objeto que contiene los productos
const productos = document.querySelector("#listado-productos");

// Verificar si existe el objeto en el sDOM
if (productos) {
  // Agregar un evento click sobre los input de cada producto
  productos.addEventListener("click", (e) => {
    // Actualizar el estado de el producto
    if (e.target.classList.contains("custom-control-label")) {
      const icono = e.target;
      const idProducto = icono.parentElement.dataset.producto;

      // Crear la ruta hacia el endpoint que actualiza el estado del producto
      const url = `${location.origin}/producto/${idProducto}`;
      axios.patch(url, { idProducto }).then(function (response) {
        if (response.status == 200) {
          // Buscamos el label y el cb
          const cb = document.getElementById(`customSwitch_${idProducto}`);
          const label = document.getElementById(`label_${idProducto}`);

          // Si esta seleccionado cambiamos el nombre
          if (cb.checked) {
            label.innerHTML = "Disponible";
          } else {
            label.innerHTML = "No Disponible";
          }
        }
      });
    }
  });
}

export default productos;
