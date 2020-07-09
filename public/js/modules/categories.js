// Importar los módulos necesarios
import axios from "axios";
import Swal from "sweetalert2";
import { locale } from "moment";

// Obtener el nombre del botón desde el DOM
const botonesEliminar = document.querySelectorAll(
  "button[name='eliminar-categoria']"
);

botonesEliminar.forEach((botonEliminar) => {
  // Agregar un evento al click del botón
  botonEliminar.addEventListener("click", (e) => {
    //  Capturar la URL del proyecto que se encuentra en una propiedad data HTML5
    const urlCategoria = e.target.dataset.categoriaUrl;
    console.log(urlCategoria);
    //sweetalert2.github.io/
    https: Swal.fire({
      title: "¿Estás seguro que deseas eliminar esta categoría?",
      text: "¡Si eliminas esta categoría no es posible recuperarla!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#56CC9D",
      cancelButtonColor: "#FF7851",
    }).then((result) => {
      // Si el usuario confirma la eliminación la categoría al hacer
      // click en el botón eliminar.
      // Nos vamos a conectar mediante axios utilizando AJAX
      if (result.value) {
        // Obtener la URL del sitio
        const url = `${location.origin}/eliminar_categoria/${urlCategoria}`;

        //   Implementar axios para la petición
        axios
          .delete(url, {
            params: {
              url: urlCategoria,
            },
          })
          .then(function (response) {
            Swal.fire("¡Eliminado!", response.data, "success");
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "¡Error!",
              text: "No se ha podido eliminar la categoría...",
            });
          });

        //   Redireccionar a /
        setTimeout(() => {
          window.location.href = "/categorias";
        }, 3000);
      }
    });
  });
});

export default botonesEliminar;
