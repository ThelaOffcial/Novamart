/**
 * store-sync.js – Live-syncs Firebase Realtime Database data into the
 * PRODUCTS / CATEGORIES / BANNERS globals used across the site.
 *
 * The site has NO hardcoded product/category/banner data anymore —
 * everything shown on the site comes from Firebase (managed via
 * admin.html). If the database is empty, the site will correctly show
 * empty states ("No products found", etc.) instead of demo content.
 *
 * IMPORTANT: `PRODUCTS` is declared with `const` in products.js, so it
 * cannot be reassigned — we mutate it IN PLACE (empty it, then refill it)
 * so every other script that already holds a reference to it keeps
 * seeing live data. CATEGORIES and BANNERS aren't declared anywhere else,
 * so we just assign them onto `window`.
 */
(function () {
  'use strict';

  const rtdb = window.firebaseRtdb;

  if (typeof PRODUCTS === 'undefined' || !Array.isArray(PRODUCTS)) {
    console.error('[NovaMart] store-sync: PRODUCTS not found — make sure products.js loads before store-sync.js.');
    return;
  }

  if (!rtdb) {
    console.warn('[NovaMart] store-sync: Firebase Realtime Database not available. The site has no local fallback data, so pages will show empty until this is fixed.');
    return;
  }

  function toArray(val) {
    if (!val) return [];
    return Object.keys(val).map(key => {
      const item = val[key] || {};
      return Object.assign({}, item, { id: (item.id !== undefined && item.id !== null) ? item.id : key });
    });
  }

  function notifyUpdated() {
    window.dispatchEvent(new CustomEvent('novamart:dataUpdated'));
  }

  // ----- Products: Firebase is the sole source of truth -----
  rtdb.ref('products').on('value', (snap) => {
    const liveProducts = toArray(snap.val());
    PRODUCTS.length = 0;
    liveProducts.forEach(p => PRODUCTS.push(p));
    notifyUpdated();
  }, (err) => {
    console.error('[NovaMart] store-sync: failed to read products from Firebase:', err.message);
  });

  // ----- Categories -----
  rtdb.ref('categories').on('value', (snap) => {
    window.CATEGORIES = toArray(snap.val()).sort((a, b) => (a.order || 0) - (b.order || 0));
    notifyUpdated();
  }, (err) => {
    console.error('[NovaMart] store-sync: failed to read categories from Firebase:', err.message);
  });

  // ----- Banners -----
  rtdb.ref('banners').on('value', (snap) => {
    window.BANNERS = toArray(snap.val()).sort((a, b) => (a.order || 0) - (b.order || 0));
    notifyUpdated();
  }, (err) => {
    console.error('[NovaMart] store-sync: failed to read banners from Firebase:', err.message);
  });

})();
