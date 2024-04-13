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
app.use(express.static('public/favorites')); // Para servir el favorites.html
app.use(express.static('public/payment')); // Para servir el payment.html

// Para coger todos los productos disponibles
let products = require('./products.json');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Para servir el cart.html
app.get('/cart.html', function(req, res) {
  res.sendFile(__dirname + '/public/cart/cart.html');
});

// Para servir el favorites.html
app.get('/favorites.html', function(req, res) {
  res.sendFile(__dirname + '/public/favorites/favorites.html');
});

// Para la pagina de pago
app.get('/payment.html', function(req, res) {
  res.sendFile(__dirname + '/public/payment/payment.html');
});

app.get('/favorites', (req, res) => {
  // Leer el archivo favorites.json y devolver su contenido
  fs.readFile('favoriteItems.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading favorites');
    } else {
      res.send(JSON.parse(data));
    }
  });
});

function saveCartItems() {
  fs.writeFile('cartItems.json', JSON.stringify(cartItems), (err) => {
    if (err) throw err;
    console.log('Los productos del carrito se han guardado en cartItems.json');
  });
}

// Para almacenar los productos del carrito
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

// Array para almacenar los favoritos
fs.readFile('favoriteItems.json', (err, data) => {
  if (err) {
    if (err.code === 'ENOENT') {
      // El archivo no existe, crea uno nuevo con un array vacío
      fs.writeFile('favoriteItems.json', JSON.stringify([]), (err) => {
        if (err) throw err;
        // El archivo ha sido creado, ahora puedes leerlo
        fs.readFile('favoriteItems.json', (err, data) => {
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
    favoriteItems = JSON.parse(data);
  }
});

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Emitir el estado actual del carrito cuando un cliente se conecta
  socket.on('getCart', () => {
    io.emit('updateCart', cartItems);
  });

  // Manejar la solicitud de mostrar los artículos favoritos
  socket.on('showFavorites', () => {
    io.emit('updateFavorites', favoriteItems);
  });

  // Manejar la adición de un nuevo ítem al carrito
  socket.on('addItem', (item) => {
    // Verificar si el artículo ya está en el carrito
    const existingItem = cartItems.find(cartItem => cartItem.product === item.product);

    if (existingItem) {
      // Si el artículo ya está en el carrito, incrementa la cantidad
      existingItem.quantity += 1;
    } else {
      // Si el artículo no está en el carrito, añádelo con una cantidad de 1
      item.quantity = 1;
      cartItems.push(item);
    }

    io.emit('updateCart', cartItems);
    saveCartItems();
  });

  // Manejar la adición de un artículo a favoritos
  socket.on('addToFavorites', (item) => {
    // Verificar si el artículo ya está en la lista de favoritos
    const existingItem = favoriteItems.find(favItem => favItem.product === item.product);
    console.log(existingItem);
    
    if (!existingItem) {
      // Si el artículo no está en la lista de favoritos, añadirlo
      favoriteItems.push(item);
      fs.writeFileSync('favoriteItems.json', JSON.stringify(favoriteItems));
      io.emit('updateFavorites', favoriteItems);
      console.log('El artículo ha sido añadido a la lista de favoritos.');
    }
  });

  // Manejar la eliminación de un artículo de favoritos
  socket.on('removeFromFavorites', (index) => {
    favoriteItems.splice(index, 1);
    fs.writeFileSync('favoriteItems.json', JSON.stringify(favoriteItems));
    io.emit('updateFavorites', favoriteItems);
  });

  // Manejar la búsqueda de productos
  socket.on('searchProducts', (query) => {
    const results = products.filter(product => product.product.toLowerCase().includes(query.toLowerCase()));
    io.emit('searchResults', results);
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

  socket.on('updateItem', (updatedItem) => {
    const index = cartItems.findIndex(item => item.product === updatedItem.product);
    if (index !== -1) {
      cartItems[index] = updatedItem;
      io.emit('updateCart', cartItems);
      saveCartItems();
    }
  });

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
