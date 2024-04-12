const socket = io();

// Emitir el evento 'showFavorites' cuando la página se carga
window.onload = function() {
  socket.emit('showFavorites');
};

socket.on('updateFavorites', (favoriteItems) => {
  const favoriteItemsDiv = document.getElementById('favoriteItems');
  favoriteItemsDiv.innerHTML = '';
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
      img.style.border = '2px solid red';
    }

    // Añade un evento de doble clic a la imagen
    img.addEventListener('dblclick', function() {
      item.isFavorite = !item.isFavorite;
      if (item.isFavorite) {
        img.style.border = '2px solid red';
        socket.emit('addToFavorites', item); // Emitir el evento 'addToFavorites' cuando un artículo se marca como favorito
      } else {
        img.style.border = '';
      }
      socket.emit('updateItem', item);
    });

    const textDiv = document.createElement('div');

    const name = document.createElement('p');
    name.textContent = `Producto: ${item.product}`;
    name.className = 'item-name';

    const price = document.createElement('p');
    price.textContent = `Precio: ${item.price} €`;
    price.className = 'item-price';

    textDiv.appendChild(name);
    textDiv.appendChild(price);

    itemDiv.appendChild(img);
    itemDiv.appendChild(textDiv);

    favoriteItemsDiv.appendChild(itemDiv);
  });
});