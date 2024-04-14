const socket = io();

// Emitir el evento 'showFavorites' cuando la página se carga
window.onload = function() {
  socket.emit('showFavorites');
};

socket.on('updateFavorites', (favoriteItems) => {
  const favoriteItemsDiv = document.getElementById('favoriteItems');
  favoriteItemsDiv.innerHTML = '';

  // Define el controlador de eventos como una función para poder eliminarlo más tarde
  function handleSortOptionsChange(e) {
    const sortOption = e.target.value;
    if (sortOption === 'type') {
      // Ordenar por tipo de artículo
      favoriteItems.sort((a, b) => a.type.localeCompare(b.type));
    } else if (sortOption === 'priceAsc') {
      // Ordenar por precio de menor a mayor
      favoriteItems.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      // Ordenar por precio de mayor a menor
      favoriteItems.sort((a, b) => b.price - a.price);
    }
    socket.emit('sortedFavs', favoriteItems);
  }

  const sortOptions = document.getElementById('sortOptions');

  // Asegúrate de que el controlador de eventos se agrega solo una vez
  if (!sortOptions._hasChangeEvent) {
    sortOptions.addEventListener('change', handleSortOptionsChange);
    sortOptions._hasChangeEvent = true;
  }

  favoriteItems.forEach(item => {
    console.log(item);
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';

    const img = document.createElement('img');
    img.src = item.image || 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // URL de la imagen por defecto
    img.alt = item.product;
    img.className = 'item-image';

    // Añade un borde rojo a los productos favoritos
    if (item.isFavorite) {
      img.style.border = '2px solid #FF2E82';
    }

    // Añade un evento de doble clic a la imagen
    img.addEventListener('dblclick', function() {
      item.isFavorite = !item.isFavorite;
      if (item.isFavorite) {
        img.style.border = '2px solid #FF2E82';
        socket.emit('addToFavorites', item); // Emitir el evento 'addToFavorites' cuando un artículo se marca como favorito
      } else {
        img.style.border = '';
        socket.emit('removeFromFavorites', favoriteItems.indexOf(item));
      }
      socket.emit('updateItem', item);
    });

    const textDiv = document.createElement('div');

    const name = document.createElement('p');
    name.textContent = `Producto: ${item.product}`;
    name.className = 'item-name';

    const type = document.createElement('p');
    type.textContent = `Tipo: ${item.type || 'No especificado'}`;
    type.className = 'item-type';

    const price = document.createElement('p');
    price.textContent = `Precio: ${item.price} €`;
    price.className = 'item-price';

    textDiv.appendChild(name);
    textDiv.appendChild(price);
    textDiv.appendChild(type);

    itemDiv.appendChild(img);
    itemDiv.appendChild(textDiv);

    favoriteItemsDiv.appendChild(itemDiv);
  });
});

// Si giro el dispositivo hacia la derecha, redirigir a la página del carrito
window.addEventListener('deviceorientation', function(event) {
  const threshold = 45; // Adjust this value according to your needs

  if (event.gamma > threshold) {
    window.location.href = './index.html';
  }
});