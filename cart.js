/**
 * cart.js – Shopping cart management with localStorage
 */
const Cart = (function() {
  const CART_KEY = 'novamart_cart';

  // Get cart items
  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }

  // Save cart
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // Add product to cart (or increment quantity)
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

  // Remove item completely
  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
    return cart;
  }

  // Update quantity (if 0, remove)
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

  // Get cart total price (needs product data – we'll pass product map externally)
  function getCartTotal(productsMap) {
    const cart = getCart();
    let total = 0;
    cart.forEach(item => {
      const product = productsMap[item.productId];
      if (product) {
        total += product.price * item.quantity;
      }
    });
    return total;
  }

  // Get full cart with product details (pass products array)
  function getFullCart(products) {
    const cart = getCart();
    const productMap = {};
    products.forEach(p => productMap[p.id] = p);
    return cart.map(item => ({
      ...item,
      product: productMap[item.productId] || null
    })).filter(item => item.product !== null);
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