/**
 * store-sync.js – Live-syncs Firebase Realtime Database data into the
 * PRODUCTS / CATEGORIES / BANNERS globals used across the site.
 *
 * This file was missing from the repo, which is why:
 *   - Products added/edited/deleted in admin.html never showed up on
 *     index.html, product.html, cart.html, etc. (they only ever lived in
 *     the static demo catalog from products.js).
 *   - The search bar only ever matched that static demo catalog, so it
 *     could "find" items that don't actually exist in the database.
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
    console.warn('[NovaMart] store-sync: Firebase Realtime Database not available. Falling back to the static demo catalog only — admin changes will not appear.');
    return;
  }

  // Keep a pristine copy of the original demo catalog so admin-added /
  // admin-edited products can be merged with it instead of wiping it out.
  const STATIC_PRODUCTS = PRODUCTS.slice();

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

  // ----- Products: merge live Firebase data over the static demo catalog -----
  rtdb.ref('products').on('value', (snap) => {
    const liveProducts = toArray(snap.val());

    const merged = new Map();
    STATIC_PRODUCTS.forEach(p => merged.set(String(p.id), p));
    liveProducts.forEach(p => merged.set(String(p.id), p)); // live data wins on id collisions, and adds new ones

    const finalList = Array.from(merged.values());
    PRODUCTS.length = 0;
    finalList.forEach(p => PRODUCTS.push(p));

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
