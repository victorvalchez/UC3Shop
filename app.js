const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static('public')); // Para servir el index.html
app.use(express.static('public/cart')); // Para servir el cart.html

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/cart.html', function(req, res) {
  res.sendFile(__dirname + '/public/cart/cart.html');
});

function saveCartItems() {
  fs.writeFile('cartItems.json', JSON.stringify(cartItems), (err) => {
    if (err) throw err;
    console.log('Los productos del carrito se han guardado en cartItems.json');
  });
}

fs.readFile('cartItems.json', (err, data) => {
  if (err) {
    if (err.code === 'ENOENT') {
      // El archivo no existe, crea uno nuevo con un array vacío
      fs.writeFile('cartItems.json', JSON.stringify([]), (err) => {
        if (err) throw err;
        // El archivo ha sido creado, ahora puedes leerlo
        fs.readFile('cartItems.json', (err, data) => {
          if (err) throw err;
          if (data) {
            cartItems = JSON.parse(data);
          }
        });
      });
    } else {
      // Otro error ocurrió
      throw err;
    }
  } else if (data) {
    // El archivo existe, analiza los datos
    cartItems = JSON.parse(data);
  }
});

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    // Emitir el estado actual del carrito cuando un cliente se conecta
    socket.emit('updateCart', cartItems);

    // Manejar la adición de un nuevo ítem al carrito
    socket.on('addItem', (item) => {
      cartItems.push(item);
      io.emit('updateCart', cartItems);
      saveCartItems();
    });
    
    // Manejar la eliminación de un ítem del carrito
    socket.on('removeItem', (index) => {
      cartItems.splice(index, 1);
      io.emit('updateCart', cartItems);
      saveCartItems();
    });

    // Manejar la limpieza del carrito
    socket.on('clearCart', () => {
      cartItems = [];
      io.emit('updateCart', cartItems);
      // Escribir el array cartItems vacío en el archivo cartItems.json
      fs.writeFile('cartItems.json', JSON.stringify(cartItems), (err) => {
        if (err) throw err;
        console.log('El carrito ha sido limpiado y los cambios se han guardado en el archivo cartItems.json.');
      });
    });

    socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado');
    });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
