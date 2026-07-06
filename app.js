/**
 * app.js – Main application logic for homepage
 * Handles rendering, search, banner, modals, etc.
 * Now data-driven from Firebase Realtime Database via store-sync.js:
 * PRODUCTS / CATEGORIES / BANNERS are live arrays that get mutated by
 * store-sync.js whenever admin.html saves a change, and this file
 * re-renders automatically on the `novamart:dataUpdated` event.
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

  // ----- Data (live — mutated in place by store-sync.js) -----
  const products = (typeof PRODUCTS !== 'undefined') ? PRODUCTS : [];
  let productMap = {};

  function rebuildProductMap() {
    productMap = {};
    products.forEach(p => productMap[p.id] = p);
  }
  rebuildProductMap();

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

    card.addEventListener('click', () => {
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

  // ----- Category Grid + Nav (data-driven, editable from admin.html) -----
  function getCategories() {
    return window.CATEGORIES || [];
  }

  function renderCategories() {
    const cats = getCategories();
    categoryGrid.innerHTML = '';
    cats.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'category-card';
      card.innerHTML = `
        <div class="category-card__icon"><i class="fas ${cat.icon || 'fa-tag'}"></i></div>
        <div class="category-card__name">${cat.name}</div>
      `;
      card.addEventListener('click', () => {
        filterByCategory(cat.name);
      });
      categoryGrid.appendChild(card);
    });

    // Rebuild the top nav list too (keep "All" first)
    if (categoryList) {
      let html = `<li><a href="#" data-category="all" class="active">All</a></li>`;
      cats.forEach(cat => {
        html += `<li><a href="#" data-category="${cat.name}">${cat.name}</a></li>`;
      });
      categoryList.innerHTML = html;
    }
  }

  // ----- Category filter -----
  function filterByCategory(category) {
    document.querySelectorAll('.category-nav__list a').forEach(a => a.classList.remove('active'));
    const navLink = document.querySelector(`.category-nav__list a[data-category="${category}"]`);
    if (navLink) navLink.classList.add('active');
    else {
      document.querySelector('.category-nav__list a[data-category="all"]')?.classList.add('active');
    }
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    renderProductGrid(trendingProducts, filtered, 8);
    renderProductGrid(recommendedProducts, filtered.slice(8), 8);
    document.querySelector('.section').scrollIntoView({ behavior: 'smooth' });
  }

  // ----- Site Settings (Flash Sale + Deal of the Day) -----
  // 100% admin-controlled from admin.html → Homepage Content.
  // Falls back to sensible defaults only when the admin hasn't set a value yet.
  function getSettings() {
    return window.SITE_SETTINGS || {};
  }

  function countdownTo(endsAt, els, onExpire) {
    function tick() {
      const diff = (endsAt || 0) - Date.now();
      let h = 0, m = 0, s = 0;
      if (diff > 0) {
        h = Math.floor(diff / 3600000);
        m = Math.floor((diff % 3600000) / 60000);
        s = Math.floor((diff % 60000) / 1000);
      } else if (typeof onExpire === 'function') {
        onExpire();
      }
      const pad = n => String(n).padStart(2, '0');
      if (els.hours) els.hours.textContent = pad(h);
      if (els.minutes) els.minutes.textContent = pad(m);
      if (els.seconds) els.seconds.textContent = pad(s);
    }
    tick();
    return setInterval(tick, 1000);
  }

  // ----- Flash Sales (product list + countdown, editable from admin.html) -----
  let flashIntervalId = null;
  function renderFlashSales() {
    const settings = getSettings().flashSale || {};
    const flashSection = flashProducts ? flashProducts.closest('.section--flash') : null;

    // Admin can disable the whole section
    if (flashSection) {
      flashSection.style.display = settings.enabled === false ? 'none' : '';
    }

    const flashTitleEl = document.getElementById('flashSaleTitle');
    if (flashTitleEl) flashTitleEl.textContent = settings.title || 'Flash Sale';

    const flash = products.filter(p => p.discount > 10).sort(() => Math.random() - 0.5).slice(0, 8);
    renderProductGrid(flashProducts, flash, 8);

    if (flashIntervalId) clearInterval(flashIntervalId);
    // Admin sets a real target end time; if none is configured yet, default
    // to 3 hours from now so the section still looks alive on a fresh install.
    const endsAt = settings.endsAt || (Date.now() + 3 * 3600000);
    flashIntervalId = countdownTo(endsAt, {
      hours: document.getElementById('flashHours'),
      minutes: document.getElementById('flashMinutes'),
      seconds: document.getElementById('flashSeconds')
    });
  }

  // ----- Deal of the Day (fully editable from admin.html) -----
  let dealIntervalId = null;
  function renderDealBanner() {
    const deal = getSettings().dealOfDay || {};
    const dealBanner = document.getElementById('dealBanner');
    const dealEyebrow = document.getElementById('dealEyebrow');
    const dealTitle = document.getElementById('dealTitle');
    const dealBtn = document.getElementById('dealBtn');

    if (dealBanner) {
      dealBanner.style.display = deal.enabled === false ? 'none' : '';
      if (deal.gradientFrom || deal.gradientTo) {
        dealBanner.style.background = `linear-gradient(135deg, ${deal.gradientFrom || '#0f3460'}, ${deal.gradientTo || '#533483'})`;
      }
    }
    if (dealEyebrow) dealEyebrow.textContent = deal.eyebrow || '⚡ DEAL OF THE DAY';
    if (dealTitle) dealTitle.innerHTML = deal.title || 'Top Electronics<br>At Lowest Prices';
    if (dealBtn) {
      dealBtn.textContent = '';
      dealBtn.innerHTML = `${deal.buttonText || 'Shop Now'} <i class="fas fa-arrow-right"></i>`;
      dealBtn.href = deal.link || '#';
    }

    if (dealIntervalId) clearInterval(dealIntervalId);
    const endsAt = deal.endsAt || (() => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return end.getTime();
    })();
    dealIntervalId = countdownTo(endsAt, {
      hours: document.getElementById('dealH'),
      minutes: document.getElementById('dealM'),
      seconds: document.getElementById('dealS')
    });
  }

  // ----- Site Content (100% of the homepage's static content, editable from
  // admin.html → Site Content). Every field falls back to the original
  // hand-written copy if the admin hasn't set it yet, so nothing ever looks
  // broken on a fresh install. -----
  function renderSiteContent() {
    const sc = getSettings().siteContent || {};

    // Brand / logo
    const brandPrefix = document.getElementById('brandPrefix');
    const brandHighlight = document.getElementById('brandHighlight');
    const brandBadge = document.getElementById('brandBadge');
    if (brandPrefix) brandPrefix.textContent = sc.brandPrefix || 'Nova';
    if (brandHighlight) brandHighlight.textContent = sc.brandHighlight || 'Mart';
    if (brandBadge) brandBadge.textContent = sc.brandBadge || 'GLOBAL';

    // Accent theme color
    if (sc.themeColor) {
      document.documentElement.style.setProperty('--primary', sc.themeColor);
    }

    // Side promo boxes
    (sc.sidePromos || []).forEach((p, i) => {
      const el = document.getElementById(`sidePromo${i + 1}`);
      if (!el) return;
      el.href = p.link || '#';
      const label = el.querySelector('.side-promo__label');
      const title = el.querySelector('.side-promo__title');
      const badge = el.querySelector('.side-promo__badge');
      if (label) label.textContent = p.label || '';
      if (title) title.textContent = p.title || '';
      if (badge) badge.textContent = p.badge || '';
    });

    // Category strip title
    const catStripTitle = document.getElementById('catStripTitle');
    if (catStripTitle) catStripTitle.textContent = sc.catStripTitle || 'Browse Categories';

    // Section titles
    const setTitle = (id, fallback) => {
      const el = document.getElementById(id);
      if (el) el.textContent = sc[id] || fallback;
    };
    setTitle('shopByCategoryTitle', 'Shop by Category');
    setTitle('trendingSectionTitle', '🔥 Trending Now');
    setTitle('recommendedSectionTitle', '⭐ Recommended for You');
    setTitle('topBrandsSectionTitle', '🏷️ Top Brands');

    // Top Brands strip
    const brandsStrip = document.getElementById('brandsStrip');
    if (brandsStrip) {
      const brands = (sc.topBrands && sc.topBrands.length)
        ? sc.topBrands
        : ['Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'LG', 'Xiaomi', 'Huawei', 'Philips', 'Puma'];
      brandsStrip.innerHTML = brands.map(b => `<div class="brand-card">${b}</div>`).join('');
    }

    // App download banner
    const appBannerSection = document.getElementById('appBannerSection');
    if (appBannerSection) appBannerSection.style.display = (sc.appBanner && sc.appBanner.enabled === false) ? 'none' : '';
    const ab = sc.appBanner || {};
    const appHeading = document.getElementById('appBannerHeading');
    const appText = document.getElementById('appBannerText');
    const appStoreLink = document.getElementById('appStoreLink');
    const googlePlayLink = document.getElementById('googlePlayLink');
    if (appHeading) appHeading.textContent = ab.heading || '📱 Shop On the Go!';
    if (appText) appText.textContent = ab.text || 'Download the NovaMart app and get exclusive mobile-only deals every day.';
    if (appStoreLink) appStoreLink.href = ab.appStoreUrl || '#';
    if (googlePlayLink) googlePlayLink.href = ab.googlePlayUrl || '#';

    // Footer
    const fc = sc.footer || {};
    const footerDesc = document.getElementById('footerDesc');
    if (footerDesc) footerDesc.textContent = fc.description || 'Your one-stop marketplace for quality products at unbeatable prices. Shop with confidence — best deals, every day.';

    const socialDefaults = { facebook: '#', twitter: '#', instagram: '#', youtube: '#', tiktok: '#' };
    const social = Object.assign({}, socialDefaults, fc.social || {});
    Object.keys(social).forEach(key => {
      const a = document.getElementById(`footerSocial_${key}`);
      if (a) a.href = social[key] || '#';
    });

    function renderFooterCol(colKey, titleFallback, itemsFallback, extraItemsHtml) {
      const titleEl = document.getElementById(`${colKey}Title`);
      const listEl = document.getElementById(`${colKey}List`);
      const col = fc[colKey] || {};
      if (titleEl) titleEl.textContent = col.title || titleFallback;
      if (listEl) {
        const items = (col.items && col.items.length) ? col.items : itemsFallback;
        listEl.innerHTML = items.map(it => `<li><a href="${it.link || '#'}">${it.label}</a></li>`).join('') + (extraItemsHtml || '');
      }
    }
    renderFooterCol('footerCol1', 'Customer Care', [
      { label: 'Help Center', link: '#' },
      { label: 'Track Your Order', link: '#' },
      { label: 'Returns & Refunds', link: '#' },
      { label: 'Shipping Info', link: '#' },
      { label: 'Contact Us', link: '#' },
      { label: 'Report a Problem', link: '#' }
    ]);
    renderFooterCol('footerCol2', 'NovaMart', [
      { label: 'About Us', link: '#' },
      { label: 'Careers', link: '#' },
      { label: 'Press', link: '#' },
      { label: 'Affiliates', link: '#' },
      { label: 'Sell on NovaMart', link: '#' }
    ], '<li><a href="admin.html">Admin Panel</a></li>');

    const footerCopyright = document.getElementById('footerCopyright');
    if (footerCopyright) footerCopyright.textContent = fc.copyright || '© 2026 NovaMart Global. All rights reserved.';
  }

  // ----- Trending & Recommended -----
  function renderTrending() {
    const trending = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);
    renderProductGrid(trendingProducts, trending, 8);
  }

  function renderRecommended() {
    const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 8);
    renderProductGrid(recommendedProducts, shuffled, 8);
  }

  // ----- Banner Slider (data-driven, editable from admin.html) -----
  let bannerAutoInterval = null;
  let bannerGoTo = () => {};

  function getBanners() {
    return window.BANNERS || [];
  }

  function renderBanner() {
    const banners = getBanners();
    const total = banners.length;
    let current = 0;

    bannerTrack.innerHTML = banners.map(b => `
      <div class="banner-slide" style="background: linear-gradient(135deg, ${b.gradientFrom || '#FF6B00'}, ${b.gradientTo || '#FF9F1A'});">
        <div class="banner-slide__content">
          <span class="banner-slide__tag">${b.tag || ''}</span>
          <h2>${b.title || ''}</h2>
          <p>${b.sub || ''}</p>
          <a href="${b.link || '#'}" class="btn btn--white">${b.btnText || 'Shop Now'}</a>
        </div>
        ${b.image ? `<img src="${b.image}" alt="${b.title || ''}" class="banner-slide__img" />` : ''}
      </div>
    `).join('');

    bannerDots.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      bannerDots.appendChild(dot);
    }

    function goTo(index) {
      if (total === 0) return;
      current = (index + total) % total;
      bannerTrack.style.transform = `translateX(-${current * 100}%)`;
      document.querySelectorAll('.banner-slider__dots span').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }
    bannerGoTo = goTo;

    if (bannerAutoInterval) clearInterval(bannerAutoInterval);
    function next() { goTo(current + 1); }
    function startAutoSlide() {
      if (total > 1) bannerAutoInterval = setInterval(next, 4000);
    }
    startAutoSlide();

    const slider = document.querySelector('.banner-slider');
    if (slider && !slider.dataset.hoverBound) {
      slider.dataset.hoverBound = 'true';
      slider.addEventListener('mouseenter', () => { if (bannerAutoInterval) clearInterval(bannerAutoInterval); });
      slider.addEventListener('mouseleave', startAutoSlide);
    }
  }

  // banner arrow buttons — bound once, always call the current bannerGoTo
  let bannerCurrentIndex = 0;
  bannerNext.addEventListener('click', () => {
    const total = getBanners().length;
    if (total === 0) return;
    if (bannerAutoInterval) clearInterval(bannerAutoInterval);
    bannerCurrentIndex = (bannerCurrentIndex + 1) % total;
    bannerGoTo(bannerCurrentIndex);
  });
  bannerPrev.addEventListener('click', () => {
    const total = getBanners().length;
    if (total === 0) return;
    if (bannerAutoInterval) clearInterval(bannerAutoInterval);
    bannerCurrentIndex = (bannerCurrentIndex - 1 + total) % total;
    bannerGoTo(bannerCurrentIndex);
  });

  // ----- Quick View Modal -----
  function openQuickView(productId) {
    const product = productMap[productId];
    if (!product) return;
    quickViewBody.innerHTML = '';
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
    if (userNameLabel) {
      userNameLabel.textContent = user ? user.name : 'Sign In';
    }
  }

  // ----- Search functionality -----
  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchSuggestions.classList.remove('active');
      return;
    }

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

    let terms = [q];
    for (const [key, values] of Object.entries(synonyms)) {
      if (q.includes(key) || key.includes(q)) {
        terms = terms.concat(values);
      }
    }
    const words = q.split(/\s+/);
    terms = terms.concat(words);
    terms = [...new Set(terms)];

    const scored = products.filter(p => Number(p.stock) > 0).map(p => {
      let score = 0;
      const searchable = (p.name + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase();
      for (const term of terms) {
        if (searchable.includes(term)) {
          score += 1;
        }
      }
      const nameLower = p.name.toLowerCase();
      for (const term of terms) {
        if (nameLower.includes(term)) {
          score += 2;
        }
      }
      return { product: p, score };
    });

    const results = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.product);
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
          const id = parseInt(el.dataset.id);
          window.location.href = `product.html?id=${id}`;
        });
      });
    }
    searchSuggestions.classList.add('active');
  }

  searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        performSearch(query);
      }
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
      searchSuggestions.classList.remove('active');
    }
  });

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      performSearch(query);
    }
  });

  // Category nav clicks (delegated — works even after categoryList is rebuilt)
  categoryList.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();
    const category = link.dataset.category;
    filterByCategory(category);
    categoryDropdown.classList.remove('active');
  });

  // ----- "All Categories" dropdown (toggle button in category nav) -----
  const categoryToggle = document.getElementById('categoryToggle');
  const categoryDropdown = document.createElement('div');
  categoryDropdown.className = 'category-dropdown';
  categoryDropdown.id = 'categoryDropdown';
  if (categoryToggle) {
    categoryToggle.insertAdjacentElement('afterend', categoryDropdown);

    function renderCategoryDropdown() {
      const cats = getCategories();
      categoryDropdown.innerHTML = `
        <a href="#" data-category="all"><i class="fas fa-border-all"></i> All Categories</a>
        ${cats.map(c => `<a href="#" data-category="${c.name}"><i class="fas ${c.icon || 'fa-tag'}"></i> ${c.name}</a>`).join('')}
      `;
    }
    renderCategoryDropdown();
    window.addEventListener('novamart:dataUpdated', renderCategoryDropdown);

    categoryToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      categoryDropdown.classList.toggle('active');
    });
    categoryDropdown.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      e.preventDefault();
      filterByCategory(link.dataset.category);
      categoryDropdown.classList.remove('active');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.category-nav__toggle') && !e.target.closest('.category-dropdown')) {
        categoryDropdown.classList.remove('active');
      }
    });
  }

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
    window.location.href = 'login.html';
  });

  // ----- Full render pass (called on init AND whenever Firebase data changes) -----
  function renderAll() {
    rebuildProductMap();
    renderCategories();
    renderBanner();
    renderSiteContent();
    renderFlashSales();
    renderDealBanner();
    renderTrending();
    renderRecommended();
    renderRecentlyViewed();
    updateCartBadge();
    updateWishlistBadge();
  }

  // ----- Initialize -----
  function init() {
    renderAll();
    updateUserUI();
    Auth.getCurrentUser();

    window.addEventListener('storage', (e) => {
      if (e.key === 'novamart_cart') updateCartBadge();
      if (e.key === 'novamart_wishlist') updateWishlistBadge();
    });

    // Live updates from admin.html via Firebase Realtime Database
    window.addEventListener('novamart:dataUpdated', () => {
      renderAll();
    });
  }

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
