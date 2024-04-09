const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

let cartItems = [];

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Emitir el estado actual del carrito cuando un cliente se conecta
  socket.emit('updateCart', cartItems);

  // Manejar la adición de un nuevo ítem al carrito
  socket.on('addItem', (item) => {
    cartItems.push(item);
    io.emit('updateCart', cartItems);
  });

  // Manejar la eliminación de un ítem del carrito
  socket.on('removeItem', (index) => {
    cartItems.splice(index, 1);
    io.emit('updateCart', cartItems);
  });

  // Manejar la limpieza del carrito
  socket.on('clearCart', () => {
    cartItems = [];
    io.emit('updateCart', cartItems);
  });

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
