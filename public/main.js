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