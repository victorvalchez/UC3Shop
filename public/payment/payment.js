// Si se hace el gesto de bajar el móvil (para simular el pago), se mostrará un mensaje de agradecimiento y se cambiará la imagen de la página de pago.
window.addEventListener('deviceorientation', handleOrientation);

function handleOrientation(event) {
  var beta = event.beta; // Ángulo de inclinación hacia adelante (en grados)
  // Detectamos el movimiento hacia delante
  if (beta < -25) {
    // El dispositivo está inclinado hacia adelante, puedes realizar acciones aquí
    alert("Gracias por su pago. Su pedido está en camino.");
    document.getElementById('message').textContent = "Gracias por su confianza, disfrute de su compra";
    document.querySelector('img').src = "https://i.gifer.com/7efs.gif";
    document.getElementById('return').style.display = "block"; // Muestra el párrafo
  }
}

// Si tocamos la pantalla 3 veces se volverá a la página principal
let touches = 0;
document.addEventListener('touchstart', function(event) {
  // Prevenir el comportamiento predeterminado
  event.preventDefault();
  touches++;
  if (touches === 3) {
    window.location.href = '../index.html';
  }
});
