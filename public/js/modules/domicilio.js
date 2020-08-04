const boton = document.getElementById("atHomeLabel");
const checkAtHome = document.getElementById("customCheck_domicilio");
const oldTotal = document.getElementById("oldTotal");
const total = document.getElementById("total_");
if (boton) {
  boton.addEventListener("click", (e) => {
    if (checkAtHome.checked) {
      total.innerHTML = `${parseFloat(oldTotal.value).toFixed(2)}`;
    } else {
      const totalN = parseFloat(oldTotal.value) + 35;
      total.innerHTML = `${totalN.toFixed(2)}`;
    }
  });
}
export default boton;
