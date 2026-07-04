/* ============================================================
   NovaMart Global — Product Database & Smart Search Engine
   File: js/products.js
   ------------------------------------------------------------
   This file contains:
   1. The PRODUCTS array (populated live from Firebase by store-sync.js)
   2. A synonym dictionary used to power "smart search"
   3. Helper/query functions used across the site
      (index, product page, search results, related products, etc.)

   NOTE: PRODUCTS starts empty on purpose. All product data comes from
   Firebase Realtime Database via store-sync.js — there is no hardcoded
   demo catalog anymore. Manage products from admin.html.
   ============================================================ */

/* ------------------------------------------------------------
   1. PRODUCT CATALOG
   ------------------------------------------------------------ */
const PRODUCTS = [];
/* Product data is no longer hardcoded here — it is fetched live from
   Firebase Realtime Database ("products/") by store-sync.js and pushed
   into this array in place. Manage the catalog from admin.html. */


/* ------------------------------------------------------------
   2. SMART SEARCH — SYNONYM DICTIONARY
   ------------------------------------------------------------
   Maps a "search concept" to a list of related keywords.
   When a user searches for any keyword in a group, all keywords
   in that group are used to match against product name/tags/description.
   ------------------------------------------------------------ */
const SEARCH_SYNONYMS = [
  {
    keywords: [
      "back cover", "phone cover", "mobile cover", "phone case",
      "protective case", "shockproof case", "silicone case", "cover"
    ]
  },
  {
    keywords: [
      "headphones", "earbuds", "wireless earbuds", "bluetooth headphones",
      "gaming headset", "headset", "earphones"
    ]
  },
  {
    keywords: [
      "screen protector", "tempered glass", "glass protector", "screen guard"
    ]
  },
  {
    keywords: [
      "charger", "fast charger", "usb-c charger", "power adapter", "wall charger"
    ]
  },
  {
    keywords: [
      "power bank", "portable charger", "battery pack", "external battery"
    ]
  },
  {
    keywords: [
      "smart watch", "smartwatch", "fitness tracker", "watch", "wearable"
    ]
  },
  {
    keywords: [
      "speaker", "bluetooth speaker", "portable speaker", "wireless speaker"
    ]
  },
  {
    keywords: [
      "keyboard", "mechanical keyboard", "gaming keyboard", "rgb keyboard"
    ]
  },
  {
    keywords: [
      "mouse", "gaming mouse", "wireless mouse", "computer mouse"
    ]
  },
  {
    keywords: [
      "sneakers", "running shoes", "sports shoes", "trainers", "shoes"
    ]
  },
  {
    keywords: [
      "jacket", "coat", "leather jacket", "outerwear"
    ]
  },
  {
    keywords: [
      "yoga mat", "exercise mat", "fitness mat", "workout mat"
    ]
  },
  {
    keywords: [
      "dumbbell", "weights", "adjustable dumbbell", "hand weights"
    ]
  },
  {
    keywords: [
      "face mask", "sheet mask", "facial mask", "skincare mask"
    ]
  },
  {
    keywords: [
      "serum", "facial serum", "skincare serum", "face serum"
    ]
  },
  {
    keywords: [
      "lipstick", "lip color", "matte lipstick", "lip makeup"
    ]
  },
  {
    keywords: [
      "vacuum", "robot vacuum", "vacuum cleaner", "cleaning robot"
    ]
  },
  {
    keywords: [
      "diffuser", "essential oil diffuser", "aromatherapy diffuser", "aroma diffuser"
    ]
  },
  {
    keywords: [
      "backpack", "bag", "gym bag", "duffel bag", "hiking backpack"
    ]
  },
  {
    keywords: [
      "sunglasses", "shades", "polarized sunglasses", "eyewear"
    ]
  }
];

/* ------------------------------------------------------------
   3. HELPER / QUERY FUNCTIONS
   ------------------------------------------------------------ */

/**
 * Expand a raw search query into a list of related keywords
 * using the synonym dictionary above.
 * @param {string} query
 * @returns {string[]} list of lowercase keywords to match against
 */
function expandSearchQuery(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const expanded = new Set([q]);

  SEARCH_SYNONYMS.forEach(group => {
    const matchesGroup = group.keywords.some(
      k => k.includes(q) || q.includes(k)
    );
    if (matchesGroup) {
      group.keywords.forEach(k => expanded.add(k));
    }
  });

  return Array.from(expanded);
}

/**
 * Build a single searchable text blob for a product
 * (name + description + tags + category).
 */
function getProductSearchText(product) {
  return [
    product.name,
    product.description,
    product.category,
    ...(product.tags || [])
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whole-word / whole-phrase match test, so short keywords like "cover"
 * don't falsely match inside unrelated words like "recovery".
 */
function containsKeyword(text, keyword) {
  const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
  return pattern.test(text);
}

/**
 * Smart search across the full product catalog.
 * Matches exact keyword, partial keyword, and synonym expansions.
 * @param {string} query
 * @returns {Array} matching products, best matches first
 */
function searchProducts(query) {
  if (!query || !query.trim()) return [];

  const keywords = expandSearchQuery(query);

  const scored = PRODUCTS.map(product => {
    const searchText = getProductSearchText(product);
    let score = 0;

    keywords.forEach(keyword => {
      if (containsKeyword(searchText, keyword)) {
        // Exact / whole-word match in name gets the highest weight
        if (containsKeyword(product.name.toLowerCase(), keyword)) score += 5;
        else score += 2;
      }
    });

    return { product, score };
  });

  return scored
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.product);
}

/**
 * Get a single product by its ID.
 * @param {number|string} id
 */
function getProductById(id) {
  const numId = Number(id);
  return PRODUCTS.find(p => p.id === numId) || null;
}

/**
 * Get all products belonging to a given category.
 */
function getProductsByCategory(category, excludeId = null) {
  return PRODUCTS.filter(
    p => p.category === category && p.id !== Number(excludeId)
  );
}

/**
 * "Customers Also Viewed" — related products from the same category.
 */
function getRelatedProducts(productId, limit = 8) {
  const product = getProductById(productId);
  if (!product) return [];

  return getProductsByCategory(product.category, productId).slice(0, limit);
}

/**
 * Flash Sales — products with a high discount, sorted by discount desc.
 */
function getFlashSaleProducts(limit = 10) {
  return [...PRODUCTS]
    .filter(p => p.discount >= 30)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit);
}

/**
 * Trending Products — highest sold count.
 */
function getTrendingProducts(limit = 10) {
  return [...PRODUCTS]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, limit);
}

/**
 * Recommended Products — highest rated with a healthy review count.
 */
function getRecommendedProducts(limit = 10) {
  return [...PRODUCTS]
    .filter(p => p.reviewCount >= 50)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

/**
 * Get a list of unique category names, with product counts.
 */
function getAllCategories() {
  const map = {};
  PRODUCTS.forEach(p => {
    map[p.category] = (map[p.category] || 0) + 1;
  });
  return Object.keys(map).map(name => ({
    name,
    count: map[name]
  }));
}

/* ------------------------------------------------------------
   4. RECENTLY VIEWED (localStorage-backed)
   ------------------------------------------------------------ */
const RECENTLY_VIEWED_KEY = "novamart_recently_viewed";
const RECENTLY_VIEWED_MAX = 10;

/**
 * Record that a product was viewed (called from product.html).
 */
function addToRecentlyViewed(productId) {
  let viewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  viewed = viewed.filter(id => id !== Number(productId));
  viewed.unshift(Number(productId));
  viewed = viewed.slice(0, RECENTLY_VIEWED_MAX);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(viewed));
}

/**
 * Get the list of recently viewed products (product objects).
 */
function getRecentlyViewed() {
  const viewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  return viewed.map(id => getProductById(id)).filter(Boolean);
}