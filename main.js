// Definimos un array de productos simulados
const products = [
    { id: 1, name: 'CPU Intel i7', price: 300, image: './assets/cpu.jpg' },
    { id: 2, name: 'GPU NVIDIA RTX 3080', price: 800, image: './assets/gpu.png' },
    { id: 3, name: 'RAM 16GB DDR4', price: 100, image: './assets/ram.jpg' },
    { id: 4, name: 'SSD 1TB', price: 150, image: './assets/ssd.webp' },
];

// Función para mostrar los productos en la página
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const listItem = document.createElement('div');
        listItem.classList.add('product-item');
        
        // Agregar imagen
        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.name;

        // Establecer el tamaño de la imagen a 80x80 píxeles
        productImage.style.width = '80px';
        productImage.style.height = '80px';

        listItem.appendChild(productImage);

        // Agregar nombre y precio
        const productInfo = document.createElement('div');
        productInfo.classList.add('product-info');
        productInfo.innerHTML = `<p>${product.name}</p><p>$${product.price.toFixed(2)}</p>`;
        listItem.appendChild(productInfo);

        // Botón para agregar al carrito
        const addButton = document.createElement('button');
        addButton.textContent = 'Agregar al Carrito';
        addButton.classList.add('btn', 'btn-success', 'btn-sm');
        addButton.addEventListener('click', () => addToCart(product));
        listItem.appendChild(addButton);

        productList.appendChild(listItem);
    });

    // Verificar y cargar el carrito desde localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (savedCart.length > 0) {
        savedCart.forEach(product => addToCart(product));
    }
}

// Función para agregar un producto al carrito
function addToCart(product) {
    const cartList = document.getElementById('cart-list');
    const cartItems = cartList.getElementsByTagName('li');

    // Verificar si el producto ya está en el carrito
    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        if (item.textContent.includes(product.name)) {
            // Si el producto ya está en el carrito, aumenta la cantidad y actualiza el precio
            const quantityElement = item.querySelector('.quantity');
            const currentQuantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = currentQuantity + 1;

            // Actualizar el precio total
            const totalPrice = document.getElementById('total-price');
            const currentTotal = parseFloat(totalPrice.textContent);
            totalPrice.textContent = (currentTotal + product.price).toFixed(2);

            // Actualizar la cantidad en localStorage
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const updatedCart = cart.map(item => {
                if (item.id === product.id) {
                    item.quantity += 1;
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            return; // Salir de la función
        }
    }

    // Si el producto no está en el carrito, agregarlo
    const cartItem = document.createElement('li');
    cartItem.innerHTML = `${product.name} - $${product.price.toFixed(2)} (<span class="quantity">1</span> unidad)`;
    
    // Botón para eliminar el producto del carrito
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ml-2');
    deleteButton.addEventListener('click', () => removeFromCart(product));
    
    cartItem.appendChild(deleteButton);
    cartList.appendChild(cartItem);

    // Actualizar el precio total
    const totalPrice = document.getElementById('total-price');
    const currentTotal = parseFloat(totalPrice.textContent);
    totalPrice.textContent = (currentTotal + product.price).toFixed(2);

    // Almacenar el carrito en localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ ...product, quantity: 1 }); // Agregar una propiedad 'quantity' al producto
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para eliminar un producto del carrito
function removeFromCart(product) {
    const cartList = document.getElementById('cart-list');
    const cartItems = cartList.getElementsByTagName('li');
    
    let removed = false;

    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        if (item.textContent.includes(product.name) && !removed) {
            // Verificar si hay más de un producto del mismo tipo
            const quantityElement = item.querySelector('.quantity');
            const currentQuantity = parseInt(quantityElement.textContent);

            if (currentQuantity > 1) {
                // Si hay más de uno, disminuir la cantidad y actualizar el precio
                quantityElement.textContent = currentQuantity - 1;

                // Actualizar el precio total
                const totalPrice = document.getElementById('total-price');
                const currentTotal = parseFloat(totalPrice.textContent);
                totalPrice.textContent = (currentTotal - product.price).toFixed(2);

                // Actualizar la cantidad en localStorage
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const updatedCart = cart.map(item => {
                    if (item.id === product.id) {
                        item.quantity -= 1;
                    }
                    return item;
                });
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            } else {
                // Si solo hay uno, eliminar el elemento del carrito
                item.remove();

                // Actualizar el precio total
                const totalPrice = document.getElementById('total-price');
                const currentTotal = parseFloat(totalPrice.textContent);
                totalPrice.textContent = (currentTotal - product.price).toFixed(2);

                // Actualizar el carrito en localStorage
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const updatedCart = cart.filter(item => item.id !== product.id);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            }

            removed = true; // Marcamos como eliminado
        }
    }
}

// Función para vaciar completamente el carrito
function clearCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';

    // Actualizar el precio total
    const totalPrice = document.getElementById('total-price');
    totalPrice.textContent = '0.00';

    // Limpiar el carrito en localStorage
    localStorage.removeItem('cart');
}

// Evento para vaciar el carrito cuando se hace clic en el botón "Vaciar Carrito"
const clearCartButton = document.getElementById('clear-cart');
clearCartButton.addEventListener('click', clearCart);

// Función para procesar el pago
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    const totalPriceFormatted = totalPrice.toFixed(2);

    if (cart.length === 0) {
        alert('No hay productos en el carrito para pagar.');
    } else {
        alert(`Gracias por su compra! Total a pagar: $${totalPriceFormatted}`);
        // Aquí puedes agregar lógica adicional para procesar el pago
        // Por ejemplo, redirigir a una página de pago real.
    }
}

// Evento para procesar el pago cuando se hace clic en el botón "Pagar"
const checkoutButton = document.getElementById('checkout');
checkoutButton.addEventListener('click', checkout);

// Cargar productos al iniciar la página
displayProducts();

// Cargar el carrito desde localStorage al iniciar la página
const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
savedCart.forEach(product => addToCart(product));
