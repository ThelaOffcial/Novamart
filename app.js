/**
 * app.js – Main application logic for homepage
 * Handles rendering, search, banner, modals, etc.
 */
(function() {
  'use strict';

  // ----- DOM refs -----
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchSuggestions = document.getElementById('searchSuggestions');
  const categoryList = document.getElementById('categoryList');
  const categoryGrid = document.getElementById('categoryGrid');
  const flashProducts = document.getElementById('flashProducts');
  const trendingProducts = document.getElementById('trendingProducts');
  const recommendedProducts = document.getElementById('recommendedProducts');
  const recentlyViewedProducts = document.getElementById('recentlyViewedProducts');
  const recentlyViewedSection = document.getElementById('recentlyViewedSection');
  const headerWishlist = document.getElementById('headerWishlist');
  const headerCart = document.getElementById('headerCart');
  const headerUser = document.getElementById('headerUser');
  const userNameLabel = document.getElementById('userNameLabel');
  const wishlistCount = document.getElementById('wishlistCount');
  const cartCount = document.getElementById('cartCount');
  const bannerTrack = document.getElementById('bannerTrack');
  const bannerDots = document.getElementById('bannerDots');
  const bannerPrev = document.getElementById('bannerPrev');
  const bannerNext = document.getElementById('bannerNext');
  const quickViewModal = document.getElementById('quickViewModal');
  const quickViewOverlay = document.getElementById('quickViewOverlay');
  const quickViewClose = document.getElementById('quickViewClose');
  const quickViewBody = document.getElementById('quickViewBody');
  const toastContainer = document.getElementById('toastContainer');

  // ----- Data -----
  const products = PRODUCTS; // from products.js
  const productMap = {};
  products.forEach(p => productMap[p.id] = p);

  // ----- Utilities -----
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

  // ----- Render helpers -----
  function renderProductCard(product, options = {}) {
    const { showActions = true, showShipping = true } = options;
    const discount = product.discount || 0;
    const isWishlist = Wishlist.isInWishlist(product.id);
    const stock = product.stock || 0;
    const inStock = stock > 0;

    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    card.innerHTML = `
      <div class="product-card__image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${discount > 0 ? `<span class="product-card__badge">-${discount}%</span>` : ''}
        ${!inStock ? `<span class="product-card__badge" style="background:#64748B;">Out of Stock</span>` : ''}
        <div class="product-card__actions">
          ${showActions ? `
            <button class="quick-view-btn" title="Quick view"><i class="fas fa-eye"></i></button>
            <button class="wishlist-btn ${isWishlist ? 'active' : ''}" title="Wishlist"><i class="fas fa-heart"></i></button>
          ` : ''}
        </div>
      </div>
      <div class="product-card__body">
        <div class="product-card__name">${product.name}</div>
        <div class="product-card__rating">
          <i class="fas fa-star"></i> ${product.rating} (${product.reviewCount})
          <span style="margin-left:auto; color:var(--text-secondary); font-size:0.75rem;">Sold ${product.soldCount}</span>
        </div>
        <div class="product-card__price">
          <span class="current">$${product.price.toFixed(2)}</span>
          ${product.originalPrice > product.price ? `<span class="original">$${product.originalPrice.toFixed(2)}</span>` : ''}
          ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
        </div>
        ${showShipping && inStock ? `<div class="product-card__shipping"><i class="fas fa-truck"></i> ${product.shippingInfo || 'Free shipping'}</div>` : ''}
        <button class="btn btn--primary btn--sm product-card__add add-to-cart-btn" ${!inStock ? 'disabled' : ''}>
          <i class="fas fa-cart-plus"></i> ${inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    `;

    // Event listeners
    const quickViewBtn = card.querySelector('.quick-view-btn');
    if (quickViewBtn) {
      quickViewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openQuickView(product.id);
      });
    }

    const wishlistBtn = card.querySelector('.wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleWishlistToggle(product.id, wishlistBtn);
      });
    }

    const addBtn = card.querySelector('.add-to-cart-btn');
    if (addBtn && inStock) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        Cart.addToCart(product.id, 1);
        updateCartBadge();
        showToast(`${product.name} added to cart!`, 'success');
      });
    }

    // Click on card to go to product page (we'll use product.html?id=...)
    card.addEventListener('click', () => {
      // Save to recently viewed
      saveRecentlyViewed(product.id);
      window.location.href = `product.html?id=${product.id}`;
    });

    return card;
  }

  function renderProductGrid(container, productList, limit = 8) {
    container.innerHTML = '';
    const items = productList.slice(0, limit);
    items.forEach(p => {
      container.appendChild(renderProductCard(p));
    });
    if (items.length === 0) {
      container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-secondary);">No products found.</p>';
    }
  }

  // ----- Recently Viewed -----
  function getRecentlyViewed() {
    return JSON.parse(localStorage.getItem('novamart_recently_viewed')) || [];
  }

  function saveRecentlyViewed(productId) {
    let recent = getRecentlyViewed();
    recent = recent.filter(id => id !== productId);
    recent.unshift(productId);
    if (recent.length > 10) recent.pop();
    localStorage.setItem('novamart_recently_viewed', JSON.stringify(recent));
    renderRecentlyViewed();
  }

  function renderRecentlyViewed() {
    const recentIds = getRecentlyViewed();
    const recentProducts = recentIds.map(id => productMap[id]).filter(Boolean);
    if (recentProducts.length === 0) {
      recentlyViewedSection.style.display = 'none';
      return;
    }
    recentlyViewedSection.style.display = 'block';
    renderProductGrid(recentlyViewedProducts, recentProducts, 6);
  }

  // ----- Category Grid -----
  function renderCategories() {
    const cats = ['Electronics', 'Phone Accessories', 'Fashion', 'Gaming', 'Home & Living', 'Beauty', 'Sports'];
    categoryGrid.innerHTML = '';
    const icons = {
      Electronics: 'fa-laptop',
      'Phone Accessories': 'fa-mobile-screen',
      Fashion: 'fa-tshirt',
      Gaming: 'fa-gamepad',
      'Home & Living': 'fa-couch',
      Beauty: 'fa-spa',
      Sports: 'fa-running'
    };
    cats.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'category-card';
      card.innerHTML = `
        <div class="category-card__icon"><i class="fas ${icons[cat] || 'fa-tag'}"></i></div>
        <div class="category-card__name">${cat}</div>
      `;
      card.addEventListener('click', () => {
        filterByCategory(cat);
      });
      categoryGrid.appendChild(card);
    });
  }

  // ----- Category filter -----
  function filterByCategory(category) {
    // Update active nav
    document.querySelectorAll('.category-nav__list a').forEach(a => a.classList.remove('active'));
    const navLink = document.querySelector(`.category-nav__list a[data-category="${category}"]`);
    if (navLink) navLink.classList.add('active');
    else {
      // all
      document.querySelector('.category-nav__list a[data-category="all"]')?.classList.add('active');
    }
    // Filter products on homepage sections? We'll just scroll to top and show search results style? 
    // For simplicity, we re-render trending and recommended with filter.
    // But better to show a filtered product list – we'll just update the trending section.
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    renderProductGrid(trendingProducts, filtered, 8);
    // Also update recommended to show filtered
    renderProductGrid(recommendedProducts, filtered.slice(8), 8);
    // Flash sales remain as flash (subset)
    // Scroll to trending
    document.querySelector('.section').scrollIntoView({ behavior: 'smooth' });
  }

  // ----- Flash Sales -----
  function renderFlashSales() {
    // Pick random 8 products with discount > 10%
    const flash = products.filter(p => p.discount > 10).sort(() => Math.random() - 0.5).slice(0, 8);
    renderProductGrid(flashProducts, flash, 8);
    // Timer (fake)
    let hours = 2, minutes = 45, seconds = 30;
    const timerEls = {
      hours: document.getElementById('flashHours'),
      minutes: document.getElementById('flashMinutes'),
      seconds: document.getElementById('flashSeconds')
    };
    setInterval(() => {
      seconds--;
      if (seconds < 0) { seconds = 59; minutes--; }
      if (minutes < 0) { minutes = 59; hours--; }
      if (hours < 0) { hours = 0; minutes = 0; seconds = 0; }
      timerEls.hours.textContent = String(hours).padStart(2, '0');
      timerEls.minutes.textContent = String(minutes).padStart(2, '0');
      timerEls.seconds.textContent = String(seconds).padStart(2, '0');
    }, 1000);
  }

  // ----- Trending & Recommended -----
  function renderTrending() {
    // Sort by soldCount descending, take top 8
    const trending = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);
    renderProductGrid(trendingProducts, trending, 8);
  }

  function renderRecommended() {
    // Random 8 products (excluding trending maybe)
    const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 8);
    renderProductGrid(recommendedProducts, shuffled, 8);
  }

  // ----- Banner Slider -----
  function initBanner() {
    const slides = bannerTrack.querySelectorAll('.banner-slide');
    const total = slides.length;
    let current = 0;
    let autoSlideInterval;

    function goTo(index) {
      current = (index + total) % total;
      bannerTrack.style.transform = `translateX(-${current * 100}%)`;
      // Update dots
      document.querySelectorAll('.banner-slider__dots span').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // Create dots
    bannerDots.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      bannerDots.appendChild(dot);
    }

    bannerNext.addEventListener('click', () => { clearInterval(autoSlideInterval); next(); startAutoSlide(); });
    bannerPrev.addEventListener('click', () => { clearInterval(autoSlideInterval); prev(); startAutoSlide(); });

    function startAutoSlide() {
      autoSlideInterval = setInterval(next, 4000);
    }
    startAutoSlide();

    // Pause on hover
    const slider = document.querySelector('.banner-slider');
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', startAutoSlide);
  }

  // ----- Quick View Modal -----
  function openQuickView(productId) {
    const product = productMap[productId];
    if (!product) return;
    quickViewBody.innerHTML = '';
    // Build quick view content (simplified)
    const inStock = product.stock > 0;
    const isWishlist = Wishlist.isInWishlist(product.id);
    const div = document.createElement('div');
    div.style.display = 'grid';
    div.style.gridTemplateColumns = '1fr 1fr';
    div.style.gap = '24px';
    div.innerHTML = `
      <div><img src="${product.image}" alt="${product.name}" style="width:100%; border-radius:8px;" /></div>
      <div>
        <h2 style="margin-bottom:8px;">${product.name}</h2>
        <div style="display:flex; gap:12px; align-items:center; margin-bottom:8px;">
          <span style="font-size:1.6rem; font-weight:700; color:var(--primary);">$${product.price.toFixed(2)}</span>
          ${product.originalPrice > product.price ? `<span style="text-decoration:line-through; color:var(--text-secondary);">$${product.originalPrice.toFixed(2)}</span>` : ''}
          ${product.discount > 0 ? `<span style="background:var(--danger); color:#fff; padding:2px 10px; border-radius:12px; font-weight:600;">-${product.discount}%</span>` : ''}
        </div>
        <div style="display:flex; gap:16px; color:var(--text-secondary); font-size:0.9rem; margin-bottom:12px;">
          <span><i class="fas fa-star" style="color:#F59E0B;"></i> ${product.rating} (${product.reviewCount} reviews)</span>
          <span><i class="fas fa-shopping-bag"></i> Sold ${product.soldCount}</span>
        </div>
        <p style="margin-bottom:12px; color:var(--text-secondary);">${product.description}</p>
        <div style="margin-bottom:12px;">
          <span style="font-weight:600;">Stock:</span> ${inStock ? `${product.stock} available` : 'Out of stock'}
          <br/>
          <span style="font-weight:600;">Shipping:</span> ${product.shippingInfo || 'Free shipping'}
        </div>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <button class="btn btn--primary" id="qvAddToCart" ${!inStock ? 'disabled' : ''}>
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
          <button class="btn btn--outline" id="qvWishlist">
            <i class="fas fa-heart"></i> ${isWishlist ? 'Remove from' : 'Add to'} Wishlist
          </button>
        </div>
      </div>
    `;
    quickViewBody.appendChild(div);

    // Event listeners for quick view buttons
    const qvAdd = document.getElementById('qvAddToCart');
    if (qvAdd) {
      qvAdd.addEventListener('click', () => {
        Cart.addToCart(product.id, 1);
        updateCartBadge();
        showToast(`${product.name} added to cart!`, 'success');
        quickViewModal.classList.remove('active');
      });
    }
    const qvWish = document.getElementById('qvWishlist');
    if (qvWish) {
      qvWish.addEventListener('click', () => {
        Wishlist.toggleWishlist(product.id);
        updateWishlistBadge();
        const isNow = Wishlist.isInWishlist(product.id);
        qvWish.innerHTML = `<i class="fas fa-heart"></i> ${isNow ? 'Remove from' : 'Add to'} Wishlist`;
        showToast(isNow ? 'Added to wishlist' : 'Removed from wishlist', 'info');
        // Also update any card buttons
        document.querySelectorAll(`.product-card[data-product-id="${product.id}"] .wishlist-btn`).forEach(btn => {
          btn.classList.toggle('active', isNow);
        });
      });
    }

    quickViewModal.classList.add('active');
  }

  function closeQuickView() {
    quickViewModal.classList.remove('active');
  }

  quickViewOverlay.addEventListener('click', closeQuickView);
  quickViewClose.addEventListener('click', closeQuickView);

  // ----- Wishlist toggle from card -----
  function handleWishlistToggle(productId, btn) {
    Wishlist.toggleWishlist(productId);
    const isNow = Wishlist.isInWishlist(productId);
    btn.classList.toggle('active', isNow);
    updateWishlistBadge();
    showToast(isNow ? 'Added to wishlist' : 'Removed from wishlist', 'info');
  }

  // ----- Update badges -----
  function updateCartBadge() {
    const total = Cart.getTotalItems();
    cartCount.textContent = total;
  }

  function updateWishlistBadge() {
    const wishlist = Wishlist.getWishlist();
    wishlistCount.textContent = wishlist.length;
  }

  function updateUserUI() {
    const user = Auth.getCurrentUser();
    if (user) {
      userNameLabel.textContent = user.name;
      headerUser.querySelector('.header-action__label').textContent = user.name;
    } else {
      userNameLabel.textContent = 'Sign In';
      headerUser.querySelector('.header-action__label').textContent = 'Sign In';
    }
  }

  // ----- Search functionality -----
  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchSuggestions.classList.remove('active');
      return;
    }

    // Build synonym map
    const synonyms = {
      'back cover': ['phone cover', 'mobile cover', 'phone case', 'protective case', 'shockproof case', 'silicone case'],
      'phone cover': ['back cover', 'mobile cover', 'phone case', 'protective case', 'shockproof case', 'silicone case'],
      'mobile cover': ['back cover', 'phone cover', 'phone case', 'protective case', 'shockproof case', 'silicone case'],
      'headphones': ['earbuds', 'wireless earbuds', 'bluetooth headphones', 'gaming headset'],
      'earbuds': ['headphones', 'wireless earbuds', 'bluetooth headphones', 'gaming headset'],
      'wireless earbuds': ['headphones', 'earbuds', 'bluetooth headphones', 'gaming headset'],
      'bluetooth headphones': ['headphones', 'earbuds', 'wireless earbuds', 'gaming headset'],
      'gaming headset': ['headphones', 'earbuds', 'wireless earbuds', 'bluetooth headphones']
    };

    // Build search terms: original + synonyms
    let terms = [q];
    // Check if any key matches the query (or part of it)
    for (const [key, values] of Object.entries(synonyms)) {
      if (q.includes(key) || key.includes(q)) {
        terms = terms.concat(values);
      }
    }
    // Also split by spaces
    const words = q.split(/\s+/);
    terms = terms.concat(words);

    // Unique terms
    terms = [...new Set(terms)];

    // Score products
    const scored = products.map(p => {
      let score = 0;
      const searchable = (p.name + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase();
      for (const term of terms) {
        if (searchable.includes(term)) {
          score += 1;
        }
      }
      // Boost if term appears in name
      const nameLower = p.name.toLowerCase();
      for (const term of terms) {
        if (nameLower.includes(term)) {
          score += 2;
        }
      }
      return { product: p, score };
    });

    const results = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.product);
    // Render suggestions
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
      // Add click listeners
      searchSuggestions.querySelectorAll('.suggestion-item').forEach(el => {
        el.addEventListener('click', () => {
          const id = parseInt(el.dataset.id);
          window.location.href = `product.html?id=${id}`;
        });
      });
    }
    searchSuggestions.classList.add('active');
  }

  // Search input events
  searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        // Redirect to search results? For simplicity, we'll perform search and show suggestions.
        performSearch(query);
        // Optionally, we could redirect to product.html?search=...
        // Instead, we'll just keep suggestions open.
      }
    }
  });
  // Close suggestions on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
      searchSuggestions.classList.remove('active');
    }
  });

  // Search button click
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      performSearch(query);
    }
  });

  // ----- Category nav clicks -----
  categoryList.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();
    const category = link.dataset.category;
    filterByCategory(category);
  });

  // ----- Header actions -----
  headerWishlist.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'wishlist.html';
  });
  headerCart.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'cart.html';
  });
  headerUser.addEventListener('click', (e) => {
    e.preventDefault();
    const user = Auth.getCurrentUser();
    if (user) {
      // Logout option? For simplicity, we go to login page
      window.location.href = 'login.html';
    } else {
      window.location.href = 'login.html';
    }
  });

  // ----- Initialize -----
  function init() {
    renderCategories();
    renderFlashSales();
    renderTrending();
    renderRecommended();
    renderRecentlyViewed();
    initBanner();
    updateCartBadge();
    updateWishlistBadge();
    updateUserUI();

    // Check if user is logged in and update header
    Auth.getCurrentUser(); // just to set

    // Listen for cart/wishlist changes from other tabs (optional)
    window.addEventListener('storage', (e) => {
      if (e.key === 'novamart_cart') updateCartBadge();
      if (e.key === 'novamart_wishlist') updateWishlistBadge();
    });
  }

  // Expose some functions globally for other pages (optional)
  window.NovaMart = {
    products,
    productMap,
    Cart,
    Wishlist,
    Auth,
    showToast,
    renderProductCard,
    updateCartBadge,
    updateWishlistBadge
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();