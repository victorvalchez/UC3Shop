// Codigo que implementa la funcionalidad de escanear un código QR y enviarlo al servidor

const video = document.getElementById('preview');
const scanButton = document.getElementById('scanButton');

function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const canvasElement = document.createElement('canvas');
    const canvas = canvasElement.getContext('2d');
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });
    if (code) {
      video.pause();
      video.srcObject.getTracks().forEach(track => track.stop());
      video.style.display = 'none'; // Ocultar el video
      const product = JSON.parse(code.data);
      socket.emit('addItem', product);
    } else {
      requestAnimationFrame(tick);
    }
  } else {
    requestAnimationFrame(tick);
  }
}

scanButton.addEventListener('click', function() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(function(stream) {
      video.srcObject = stream;
      video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
      video.style.display = 'block'; // Mostrar el video
      video.play();
      requestAnimationFrame(tick);
    });
});

const socket = io();

// Funcion para obtener resultados de busqueda
document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const query = document.getElementById('searchInput').value;
  socket.emit('searchProducts', query);
});

socket.on('searchResults', (products) => {
  console.log(products);
  const resultsDiv = document.getElementById('searchResults');
  resultsDiv.innerHTML = '';
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.textContent = product.product + ' - ' + product.price + '€';
    const addButton = document.createElement('button');
    addButton.textContent = 'Añadir al carrito';
    addButton.addEventListener('click', function() {
      socket.emit('addItem', product);
    });
    productDiv.appendChild(addButton);
    resultsDiv.appendChild(productDiv);
  });
});