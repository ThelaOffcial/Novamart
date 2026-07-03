/**
 * cart-firebase.js – Shopping cart page logic
 */

(function() {
  'use strict';

  const container = document.getElementById('cartContainer');
  const cartCount = document.getElementById('cartCount');
  const wishlistCount = document.getElementById('wishlistCount');

  // Initialize
  function init() {
    updateBadges();
    renderCart();
  }

  // Render cart
  function renderCart() {
    FirebaseProducts.getAllProducts()
      .then(products => {
        const cartItems = FirebaseCart.getFullCart(products);
        const totalItems = FirebaseCart.getTotalItems();

        if (cartItems.length === 0 || totalItems === 0) {
          container.innerHTML = `
            <div class="cart-empty">
              <i class="fas fa-shopping-cart"></i>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything yet.</p>
              <a href="index-firebase.html" class="btn btn--primary">Start Shopping</a>
            </div>
          `;
          return;
        }

        let subtotal = 0;
        let itemsHtml = '';
        cartItems.forEach(item => {
          const p = item.product;
          const total = p.price * item.quantity;
          subtotal += total;
          itemsHtml += `
            <div class="cart-item" data-id="${p.id}">
              <img src="${p.image}" alt="${p.name}" />
              <div class="cart-item__info">
                <h4>${p.name}</h4>
                <div>
                  <span class="price">$${p.price.toFixed(2)}</span>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:12px;">
                <div class="cart-item__qty">
                  <button class="qty-dec" data-id="${p.id}">−</button>
                  <span>${item.quantity}</span>
                  <button class="qty-inc" data-id="${p.id}">+</button>
                </div>
                <button class="cart-item__remove" data-id="${p.id}" title="Remove item">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          `;
        });

        const shipping = subtotal > 50 ? 0 : 5.99;
        const total = subtotal + shipping;

        const html = `
          <div class="cart-layout">
            <div class="cart-items">
              ${itemsHtml}
            </div>
            <div class="cart-summary">
              <h3>Order Summary</h3>
              <div class="row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
              <div class="row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span></div>
              <div class="row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
              <button class="btn btn--primary" id="checkoutBtn"><i class="fas fa-lock"></i> Proceed to Checkout</button>
              <button class="btn btn--outline" id="clearCartBtn" style="margin-top:8px; width:100%;">Clear Cart</button>
            </div>
          </div>
        `;

        container.innerHTML = html;

        // Event listeners
        container.querySelectorAll('.qty-inc').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const item = FirebaseCart.getCart().find(i => i.productId === id);
            if (item) {
              FirebaseCart.updateQuantity(id, item.quantity + 1);
              updateBadges();
              renderCart();
            }
          });
        });

        container.querySelectorAll('.qty-dec').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const item = FirebaseCart.getCart().find(i => i.productId === id);
            if (item && item.quantity > 1) {
              FirebaseCart.updateQuantity(id, item.quantity - 1);
              updateBadges();
              renderCart();
            } else if (item) {
              FirebaseCart.removeFromCart(id);
              updateBadges();
              renderCart();
              showToast('Item removed from cart', 'info');
            }
          });
        });

        container.querySelectorAll('.cart-item__remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            FirebaseCart.removeFromCart(id);
            updateBadges();
            renderCart();
            showToast('Item removed from cart', 'info');
          });
        });

        document.getElementById('clearCartBtn')?.addEventListener('click', () => {
          FirebaseCart.clearCart();
          updateBadges();
          renderCart();
          showToast('Cart cleared', 'info');
        });

        document.getElementById('checkoutBtn')?.addEventListener('click', () => {
          if (FirebaseCart.getTotalItems() === 0) {
            showToast('Your cart is empty', 'error');
            return;
          }
          window.location.href = 'checkout.html';
        });
      })
      .catch(err => showToast('Error: ' + err, 'error'));
  }

  // Update badges
  function updateBadges() {
    cartCount.textContent = FirebaseCart.getTotalItems();
    wishlistCount.textContent = FirebaseWishlist.getWishlist().length;
  }

  // Show toast
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();