// Reemplaza el nombre de los input file por su nombre de archivo
$("#inputGroupFile02").on("change", function () {
  // Obtenemos el nombre del archivo y remplazamos el fakepath que aparece por defecto
  var fileName = $(this).val().replace("C:\\fakepath\\", " ");
  // Remplazamos el texto de seleccionar archivo por el nombre de la imagen
  $(this).next(".custom-file-label").html(fileName);
});
