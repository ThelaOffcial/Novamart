/**
 * firebase-cart.js – Shopping Cart Management with localStorage
 */

const FirebaseCart = (function() {
  const CART_KEY = 'novamart_cart_firebase';

  // Get cart items
  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }

  // Save cart
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // Add product to cart
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

  // Remove item from cart
  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
    return cart;
  }

  // Update quantity
  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    const cart = getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
    } else {
      cart.push({ productId, quantity });
    }
    saveCart(cart);
    return cart;
  }

  // Clear cart
  function clearCart() {
    saveCart([]);
  }

  // Get total items count
  function getTotalItems() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Get cart total price
  function getCartTotal(products) {
    const cart = getCart();
    let total = 0;
    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    });
    return total;
  }

  // Get full cart with product details
  function getFullCart(products) {
    const cart = getCart();
    return cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product: product || null
      };
    }).filter(item => item.product !== null);
  }

  return {
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getCartTotal,
    getFullCart
  };
})();