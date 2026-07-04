/**
 * cart.js – Cart management with localStorage
 *
 * NOTE: This file previously contained a full copy of cart.html's markup
 * by mistake (not JavaScript), which made every <script src="cart.js">
 * tag on the site throw a syntax error and left `Cart` undefined
 * everywhere (breaking "Add to Cart", cart badges, and the cart page).
 */
const Cart = (function() {
  const CART_KEY = 'novamart_cart';

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    saveCart(cart);
    return cart;
  }

  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
    return cart;
  }

  function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }
      item.quantity = quantity;
      saveCart(cart);
    }
    return cart;
  }

  function clearCart() {
    saveCart([]);
    return [];
  }

  function getTotalItems() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  function getFullCart(products) {
    const cart = getCart();
    return cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      product: products.find(p => p.id === item.productId) || null
    }));
  }

  return {
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getFullCart
  };
})();
