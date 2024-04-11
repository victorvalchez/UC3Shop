const video = document.getElementById('preview');

const socket = io();

socket.on('updateCart', (cartItems) => {
  const cartItemsDiv = document.getElementById('cartItems');
  cartItemsDiv.innerHTML = '';
  cartItems.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';

    const img = document.createElement('img');
    img.src = item.image || 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // URL de la imagen por defecto
    img.alt = item.product;
    img.className = 'item-image';

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

    cartItemsDiv.appendChild(itemDiv);
  });
});

document.getElementById('addItemForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const productName = document.getElementById('productName').value;
  const productPrice = parseFloat(document.getElementById('productPrice').value);

  if (productName && !isNaN(productPrice)) {
    socket.emit('addItem', { product: productName, price: productPrice });
    document.getElementById('addItemForm').reset();
  } else {
    alert('Por favor ingrese un nombre de producto válido y un precio numérico.');
  }
});

function removeItem(index) {
  socket.emit('removeItem', index);
}

function clearCart() {
  socket.emit('clearCart');
}