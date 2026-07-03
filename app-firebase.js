/**
 * app-firebase.js – Main Firebase marketplace homepage logic
 */

(function() {
  'use strict';

  // DOM refs
  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchSuggestions = document.getElementById('searchSuggestions');
  const cartCount = document.getElementById('cartCount');
  const wishlistCount = document.getElementById('wishlistCount');
  const userNameLabel = document.getElementById('userNameLabel');
  const headerUser = document.getElementById('headerUser');
  const toastContainer = document.getElementById('toastContainer');

  let allProducts = [];
  let currentUser = null;

  // Initialize
  async function init() {
    checkAuth();
    loadProducts();
    setupEventListeners();
    updateBadges();
  }

  // Check authentication
  function checkAuth() {
    FirebaseAuth.getCurrentUser()
      .then(user => {
        currentUser = user;
        updateUserUI();
      });
  }

  // Update user UI
  function updateUserUI() {
    if (currentUser) {
      FirebaseAuth.getUserProfile(currentUser.uid)
        .then(profile => {
          userNameLabel.textContent = profile.name;
        });
    } else {
      userNameLabel.textContent = 'Sign In';
    }
  }

  // Load products from Firebase
  function loadProducts() {
    FirebaseProducts.listenToProducts(products => {
      allProducts = products;
      renderProducts(allProducts);
    });
  }

  // Render products to grid
  function renderProducts(products) {
    productsGrid.innerHTML = '';
    if (products.length === 0) {
      productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No products found.</p>';
      return;
    }

    products.forEach(product => {
      const card = createProductCard(product);
      productsGrid.appendChild(card);
    });
  }

  // Create product card
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    const isWishlist = FirebaseWishlist.isInWishlist(product.id);
    const inStock = product.stock > 0;

    card.innerHTML = `
      <div class="product-card__image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${product.discount > 0 ? `<span class="product-card__badge">-${product.discount}%</span>` : ''}
        ${!inStock ? `<span class="product-card__badge" style="background:#64748B;">Out of Stock</span>` : ''}
        <div class="product-card__actions">
          <button class="quick-view-btn" title="Quick view"><i class="fas fa-eye"></i></button>
          <button class="wishlist-btn ${isWishlist ? 'active' : ''}" title="Wishlist"><i class="fas fa-heart"></i></button>
        </div>
      </div>
      <div class="product-card__body">
        <div class="product-card__name">${product.name}</div>
        <div class="product-card__rating">
          <i class="fas fa-star"></i> ${product.rating} (${product.reviewCount || 0})
          <span style="margin-left:auto; color:var(--text-secondary); font-size:0.75rem;">Sold ${product.soldCount || 0}</span>
        </div>
        <div class="product-card__price">
          <span class="current">$${product.price.toFixed(2)}</span>
          ${product.originalPrice > product.price ? `<span class="original">$${product.originalPrice.toFixed(2)}</span>` : ''}
          ${product.discount > 0 ? `<span class="discount">-${product.discount}%</span>` : ''}
        </div>
        <button class="btn btn--primary btn--sm product-card__add add-to-cart-btn" ${!inStock ? 'disabled' : ''}>
          <i class="fas fa-cart-plus"></i> ${inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    `;

    // Event listeners
    card.querySelector('.add-to-cart-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      FirebaseCart.addToCart(product.id, 1);
      updateBadges();
      showToast(`${product.name} added to cart!`, 'success');
    });

    card.querySelector('.wishlist-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleWishlistToggle(product.id, card.querySelector('.wishlist-btn'));
    });

    card.addEventListener('click', () => {
      window.location.href = `product-firebase.html?id=${product.id}`;
    });

    return card;
  }

  // Handle wishlist toggle
  function handleWishlistToggle(productId, btn) {
    FirebaseWishlist.toggleWishlist(productId);
    const isNow = FirebaseWishlist.isInWishlist(productId);
    btn.classList.toggle('active', isNow);
    updateBadges();
    showToast(isNow ? 'Added to wishlist' : 'Removed from wishlist', 'info');
  }

  // Update badges
  function updateBadges() {
    cartCount.textContent = FirebaseCart.getTotalItems();
    wishlistCount.textContent = FirebaseWishlist.getWishlist().length;
  }

  // Search functionality
  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchSuggestions.classList.remove('active');
      return;
    }

    FirebaseProducts.searchProducts(query)
      .then(results => {
        if (results.length === 0) {
          searchSuggestions.innerHTML = '<div class="suggestion-item">No results found</div>';
        } else {
          searchSuggestions.innerHTML = results.slice(0, 6).map(p => `
            <div class="suggestion-item" data-id="${p.id}">
              <img src="${p.image}" alt="${p.name}" />
              <span class="suggestion-name">${p.name}</span>
              <span class="suggestion-price">$${p.price.toFixed(2)}</span>
            </div>
          `).join('');

          searchSuggestions.querySelectorAll('.suggestion-item').forEach(el => {
            el.addEventListener('click', () => {
              const id = el.dataset.id;
              window.location.href = `product-firebase.html?id=${id}`;
            });
          });
        }
        searchSuggestions.classList.add('active');
      })
      .catch(err => showToast('Search error: ' + err, 'error'));
  }

  // Setup event listeners
  function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });

    searchBtn.addEventListener('click', () => {
      performSearch(searchInput.value);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar')) {
        searchSuggestions.classList.remove('active');
      }
    });

    headerUser.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentUser) {
        window.location.href = 'account.html';
      } else {
        window.location.href = 'login.html';
      }
    });

    document.getElementById('headerCart')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'cart-firebase.html';
    });

    document.getElementById('headerWishlist')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'wishlist-firebase.html';
    });
  }

  // Show toast
  function showToast(message, type = 'info') {
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