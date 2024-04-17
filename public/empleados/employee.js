const socket = io();

socket.on('updateCheckout', async (cartItems) => {
  const cartItemsDiv = document.getElementById('cartItems');
  cartItemsDiv.innerHTML = '';
  let total = 0; // Variable para almacenar el total
  
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

document.getElementById('checkoutButton').addEventListener('click', function() {
  clearCart();
});

// Manejar la ayuda al cliente
socket.on('helpAlert', function() {
  if (confirm('Un cliente necesita tu ayuda')) {
    socket.emit('helpAccepted');
  }
});