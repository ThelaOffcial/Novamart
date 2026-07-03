/**
 * firebase-products.js – Product Management Module
 */

const FirebaseProducts = (function() {
  const { db, storage } = window.firebaseServices;

  // Get all products
  function getAllProducts() {
    return new Promise((resolve, reject) => {
      db.ref('products').once('value', snapshot => {
        if (snapshot.exists()) {
          const products = [];
          snapshot.forEach(child => {
            products.push({ id: child.key, ...child.val() });
          });
          resolve(products);
        } else {
          resolve([]);
        }
      }).catch(err => reject(err));
    });
  }

  // Get product by ID
  function getProduct(productId) {
    return new Promise((resolve, reject) => {
      db.ref('products/' + productId).once('value', snapshot => {
        if (snapshot.exists()) {
          resolve({ id: snapshot.key, ...snapshot.val() });
        } else {
          reject('Product not found');
        }
      }).catch(err => reject(err));
    });
  }

  // Get products by category
  function getProductsByCategory(category) {
    return new Promise((resolve, reject) => {
      db.ref('products').orderByChild('category').equalTo(category).once('value', snapshot => {
        const products = [];
        if (snapshot.exists()) {
          snapshot.forEach(child => {
            products.push({ id: child.key, ...child.val() });
          });
        }
        resolve(products);
      }).catch(err => reject(err));
    });
  }

  // Add product (Admin only)
  function addProduct(productData) {
    return new Promise((resolve, reject) => {
      const productId = db.ref('products').push().key;
      db.ref('products/' + productId).set({
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).then(() => {
        resolve({ success: true, productId });
      }).catch(err => reject(err));
    });
  }

  // Update product (Admin only)
  function updateProduct(productId, productData) {
    return new Promise((resolve, reject) => {
      db.ref('products/' + productId).update({
        ...productData,
        updatedAt: new Date().toISOString()
      }).then(() => {
        resolve({ success: true });
      }).catch(err => reject(err));
    });
  }

  // Delete product (Admin only)
  function deleteProduct(productId) {
    return new Promise((resolve, reject) => {
      db.ref('products/' + productId).remove()
        .then(() => resolve({ success: true }))
        .catch(err => reject(err));
    });
  }

  // Search products
  function searchProducts(query) {
    return new Promise((resolve, reject) => {
      getAllProducts()
        .then(products => {
          const q = query.toLowerCase();
          const results = products.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.description.toLowerCase().includes(q)
          );
          resolve(results);
        })
        .catch(err => reject(err));
    });
  }

  // Listen to products in real-time
  function listenToProducts(callback) {
    db.ref('products').on('value', snapshot => {
      const products = [];
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          products.push({ id: child.key, ...child.val() });
        });
      }
      callback(products);
    });
  }

  return {
    getAllProducts,
    getProduct,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    listenToProducts
  };
})();