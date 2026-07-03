/**
 * wishlist.js – Wishlist management with localStorage
 */
const Wishlist = (function() {
  const WISHLIST_KEY = 'novamart_wishlist';

  function getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  }

  function saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }

  function addToWishlist(productId) {
    let wishlist = getWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      saveWishlist(wishlist);
    }
    return wishlist;
  }

  function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(id => id !== productId);
    saveWishlist(wishlist);
    return wishlist;
  }

  function isInWishlist(productId) {
    return getWishlist().includes(productId);
  }

  function toggleWishlist(productId) {
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId);
    }
  }

  function getFullWishlist(products) {
    const ids = getWishlist();
    return products.filter(p => ids.includes(p.id));
  }

  function moveToCart(productId, cartFn) {
    removeFromWishlist(productId);
    cartFn(productId, 1);
  }

  return {
    getWishlist,
    saveWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    getFullWishlist,
    moveToCart
  };
})();