// Combined JavaScript File

// Products Data
const products = [
  {
      id: 1,
      name: "Gameing Monitor",
      description: "Description of Gamining Monitor",
      price: 10.99,
      image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg"
  },
  {
      id: 2,
      name: "SSD",
      description: "Description of SSD",
      price: 20.99,
      image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg"
  },
  {
      id: 3,
      name: "Monitor",
      description: "Description of Monitor",
      price: 30.99,
      image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg"
  }
];

function fetchProducts() {
  return new Promise((resolve) => {
      setTimeout(() => resolve(products), 500);
  });
}

// Cart Operations
let cart = [];
let appliedPromoCode = null;
const promoCodes = {
  ostad10: 0.1,
  ostad5: 0.05
};

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
      const cartItem = cart.find(item => item.id === productId);
      if (cartItem) {
          cartItem.quantity += 1;
      } else {
          cart.push({ ...product, quantity: 1 });
      }
      updateCartCount();
      updateCartSummary();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  updateCartSummary();
}

function updateCartItem(productId, quantity) {
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem && quantity > 0) {
      cartItem.quantity = quantity;
  } else {
      removeFromCart(productId);
  }
  updateCartSummary();
}

function clearCart() {
  cart = [];
  appliedPromoCode = null;
  updateCartCount();
  updateCartSummary();
  renderCart();
}

function getCartSubtotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}

function getCartTotal() {
  const subtotal = parseFloat(getCartSubtotal());
  const discount = appliedPromoCode ? subtotal * promoCodes[appliedPromoCode] : 0;
  return (subtotal - discount).toFixed(2);
}

function applyPromoCode(code) {
  if (promoCodes[code]) {
      if (appliedPromoCode === code) {
          displayPromoMessage("Promo code already applied.", false);
      } else {
          appliedPromoCode = code;
          updateCartSummary();
          displayPromoMessage(`Promo code '${code}' applied successfully!`, true);
      }
  } else {
      displayPromoMessage("Invalid promo code. Please try again.", false);
  }
}

function displayPromoMessage(message, success) {
  const promoMessageEl = document.getElementById('promo-message');
  promoMessageEl.textContent = message;
  promoMessageEl.style.color = success ? 'green' : 'red';
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartSummary() {
  const subtotal = getCartSubtotal();
  const discount = appliedPromoCode ? (parseFloat(subtotal) * promoCodes[appliedPromoCode]).toFixed(2) : "0.00";
  const total = getCartTotal();

  document.getElementById('subtotal').textContent = subtotal;
  document.getElementById('discount').textContent = discount;
  document.getElementById('total-price').textContent = total;
}

// UI Rendering

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts().then(products => {
      renderProducts(products);
  });

  document.getElementById('clear-cart').addEventListener('click', () => {
      clearCart();
  });

  document.getElementById('apply-promo').addEventListener('click', () => {
      const promoCode = document.getElementById('promo-code').value.trim();
      applyPromoCode(promoCode);
  });
});

function renderProducts(products) {
  const container = document.getElementById('products-container');
  container.innerHTML = '';
  products.forEach(product => {
      const productEl = document.createElement('div');
      productEl.className = 'product';
      productEl.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="price">$${product.price}</div>
          <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      container.appendChild(productEl);
  });
}

function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  cartContainer.innerHTML = '';
  cart.forEach(item => {
      const cartItemEl = document.createElement('div');
      cartItemEl.className = 'cart-item';
      cartItemEl.innerHTML = `
          <span>${item.name} (x${item.quantity})</span>
          <div>
              <input type="number" min="1" value="${item.quantity}" onchange="updateCartItem(${item.id}, this.value)">
              <button onclick="removeFromCart(${item.id})">Remove</button>
          </div>
      `;
      cartContainer.appendChild(cartItemEl);
  });
  updateCartSummary();
}
