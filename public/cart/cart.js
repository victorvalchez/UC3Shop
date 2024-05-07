const video = document.getElementById('preview');

const socket = io();

window.onload = function() {
  socket.emit('getCart');
};

socket.on('updateCart', async (cartItems) => {
  const cartItemsDiv = document.getElementById('cartItems');
  cartItemsDiv.innerHTML = '';
  let total = 0; // Variable para almacenar el total
  let timerFav; // Variable para almacenar el temporizador
  let isLongPress = false; // Variable para comprobar si se ha mantenido pulsado
  let touchCount = 0; // Variable para contar los toques

  // Obtener los favoritos actuales
  const response = await fetch('/favorites');
  const favorites = await response.json();

  // Define el controlador de eventos como una función para poder eliminarlo más tarde
  function handleSortOptionsChange(e) {
    const sortOption = e.target.value;
    if (sortOption === 'type') {
      // Ordenar por tipo de artículo
      cartItems.sort((a, b) => a.type.localeCompare(b.type));
    } else if (sortOption === 'priceAsc') {
      // Ordenar por precio de menor a mayor
      cartItems.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      // Ordenar por precio de mayor a menor
      cartItems.sort((a, b) => b.price - a.price);
    }
    socket.emit('sortedCart', cartItems);
  }

  const sortOptions = document.getElementById('sortOptions');

  // Asegúrate de que el controlador de eventos se agrega solo una vez
  if (!sortOptions._hasChangeEvent) {
    sortOptions.addEventListener('change', handleSortOptionsChange);
    sortOptions._hasChangeEvent = true;
  }
  
  cartItems.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';

    // Comprobar si el artículo está en los favoritos
    item.isFavorite = favorites.some(favorite => favorite.product === item.product);

    const img = document.createElement('img');
    img.src = item.image || 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // URL de la imagen por defecto
    img.alt = item.product;
    img.className = 'item-image';

    // Añade un borde a los productos favoritos
    if (item.isFavorite) {
      img.style.border = '2px solid #FF2E82';
    }
    
    // Evento para eliminar un producto del carrito
    img.addEventListener('touchstart', function(event) {
      event.preventDefault();
      isLongPress = false;
      touchCount++; // Increment the touch count

      timerFav = setTimeout(() => {
        isLongPress = true;
        if (item.quantity == 1) {
          socket.emit('removeItem', cartItems.indexOf(item));
          navigator.vibrate(200);
        } else {
          item.quantity -= 1;
          socket.emit('updateItem', item);
          navigator.vibrate(200);
        }
        // Vibrar cuando se elimine un producto
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
      }, 1000); // Set timeout for 2 seconds
    });

    img.addEventListener('touchend', function(event) {
      clearTimeout(timerFav); // Cancel the timerFav if touch ends before 2 seconds

      if (!isLongPress) {
        if (touchCount === 2) {
          item.isFavorite = !item.isFavorite;
          if (item.isFavorite) {
            img.style.border = '2px solid #FF2E82';
            socket.emit('addToFavorites', item);
          } else {
            img.style.border = '';
            socket.emit('removeFromFavorites', cartItems.indexOf(item));
          }
          socket.emit('updateItem', item);
          touchCount = 0; // Reset the touch count after handling double tap
        }
      }
    });

    img.addEventListener('dblclick', function() {
      if (!isLongPress) {
        item.isFavorite = !item.isFavorite;
        if (item.isFavorite) {
          img.style.border = '2px solid #FF2E82';
          console.log(item.type);
          socket.emit('addToFavorites', item);
        } else {
          img.style.border = '';
          socket.emit('removeFromFavorites', cartItems.indexOf(item));
        }
        socket.emit('updateItem', item);
      }
    });

    const textDiv = document.createElement('div');

    const name = document.createElement('p');
    name.textContent = `Producto: ${item.product}`;
    name.className = 'item-name';

    const type = document.createElement('p');
    type.textContent = `Tipo: ${item.type || 'No especificado'}`;
    console.log("aqui esta el tipo: ", item.type);
    type.className = 'item-type';

    const price = document.createElement('p');
    price.textContent = `Precio: ${item.price}€`;
    price.className = 'item-price';

    // Añadir la cantidad del producto
    const quantity = document.createElement('p');
    quantity.textContent = `Cantidad: ${item.quantity}`;
    quantity.className = 'item-quantity';

    total += item.price * item.quantity; // Suma el precio del producto al total

    textDiv.appendChild(name);
    textDiv.appendChild(type);
    textDiv.appendChild(price);
    textDiv.appendChild(quantity); // Añadir la cantidad al div de texto

    itemDiv.appendChild(img);
    itemDiv.appendChild(textDiv);

    cartItemsDiv.appendChild(itemDiv);
  });

  const totalPriceDiv = document.getElementById('totalPrice');
  totalPriceDiv.textContent = `Precio Total: ${total}€`;
  totalPriceDiv.className = 'total-price';
  totalPriceDiv.style.fontWeight = 'bold';
  totalPriceDiv.style.color = 'white';

});

function clearCart() {
  socket.emit('clearCart');
}

// Definir los comandos de voz
var SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
var SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

const commands = { "finalizar compra": "../payment/payment.html" };
const grammar = "#JSGF V1.0; grammar commands; public = " + Object.keys(commands).join(" | ") + " ;";

speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = "es-ES";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.start();

recognition.onresult = function(event) {
  const result = event.results[0][0].transcript;
  console.log(`Resultado: ${result}.`);
  console.log(`Confianza: ${event.results[0][0].confidence}`);

  if (commands[result]) {
    // Comprobar si hay artículos en el carrito
    console.log((Array.from(cartItems.children).some(child => child.tagName === 'DIV')));
    if (Array.from(cartItems.children).some(child => child.tagName === 'DIV') === false) {
      alert('No hay artículos en el carrito.');
    } else {
      window.location.href = commands[result];
      // Limpiar el carrito después de finalizar la compra
      socket.emit('notifyCheckout');
    }
  }
};

recognition.onerror = function(event) {
  console.log(`Error occurred in recognition: ${event.error}`);
};

recognition.onspeechend = function() {
  recognition.stop();
};

recognition.onend = function() {
  recognition.start();
}

recognition.onnomatch = function(event) {
  console.log("No he reconocido el comando");
  recognition.stop();
};

recognition.onerror = function(event) {
  console.log(`Error occurred in recognition: ${event.error}`);
};

// Si giro el dispositivo hacia la izquierda, redirigir a la página de favoritos
window.addEventListener('deviceorientation', function(event) {
  const threshold = -45; // Adjust this value according to your needs
  
  if (event.gamma < threshold) {
    window.location.href = './client.html';
  }
});

// Limpiar el carrito cuando se agita el dispositivo
window.addEventListener('devicemotion', function(event) {
  const acceleration = event.accelerationIncludingGravity;
  const threshold = 30;

  if (acceleration.x > threshold || acceleration.y > threshold || acceleration.z > threshold) {
    clearCart();
  }
});

// Para llamar al empleado
let touchCountCall = 0;
let touchTimer;

window.addEventListener('touchstart', function(event) {
  if (touchCountCall === 0) {
    // Start the timer at the first touch
    touchTimer = setTimeout(() => {
      touchCountCall = 0;
    }, 1000);
  }
  touchCountCall++;
});

window.addEventListener('touchend', function(event) {
  if (touchCountCall === 3) {
    clearTimeout(touchTimer); // clear the timer
    alert('Se ha solicitado ayuda a un empleado.');
    socket.emit('helpRequest');
    touchCountCall = 0; // reset the touch count
  }
});

// Alerta del empleado
socket.on('helpAccepted', function() {
  alert('¡El empleado está en camino!');
});