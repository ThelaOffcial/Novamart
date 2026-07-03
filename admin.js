/**
 * admin.js – Admin Dashboard Logic
 */

(function() {
  'use strict';

  let currentUser = null;
  let currentProductId = null;

  // Initialize
  function init() {
    setupEventListeners();
    checkAuth();
  }

  // Check if user is authenticated and is admin
  function checkAuth() {
    FirebaseAuth.getCurrentUser()
      .then(user => {
        if (!user) {
          window.location.href = 'login.html';
          return;
        }
        currentUser = user;
        FirebaseAuth.isAdmin(user.uid)
          .then(isAdmin => {
            if (!isAdmin) {
              showToast('Access Denied: Admin privileges required', 'error');
              setTimeout(() => window.location.href = 'index-firebase.html', 2000);
              return;
            }
            loadDashboard();
            updateUserInfo();
          });
      });
  }

  // Update user info display
  function updateUserInfo() {
    const userInfo = document.getElementById('userInfo');
    if (currentUser) {
      FirebaseAuth.getUserProfile(currentUser.uid)
        .then(profile => {
          userInfo.innerHTML = `<p>Welcome, <strong>${profile.name}</strong></p><small>${currentUser.email}</small>`;
        });
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.admin-nav').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab(link.dataset.tab);
      });
    });

    // Product modal
    document.getElementById('addProductBtn')?.addEventListener('click', openProductModal);
    document.getElementById('closeProductModal')?.addEventListener('click', closeProductModal);
    document.getElementById('cancelProductBtn')?.addEventListener('click', closeProductModal);
    document.getElementById('productForm')?.addEventListener('submit', saveProduct);

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      FirebaseAuth.signOut()
        .then(() => {
          showToast('Logged out successfully', 'success');
          setTimeout(() => window.location.href = 'login.html', 1000);
        })
        .catch(err => showToast('Logout failed: ' + err.message, 'error'));
    });
  }

  // Switch tabs
  function switchTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.style.display = 'none';
    });
    const tab = document.getElementById(tabName);
    if (tab) tab.style.display = 'block';

    document.querySelectorAll('.admin-nav').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    if (tabName === 'products') loadProducts();
    if (tabName === 'orders') loadOrders();
    if (tabName === 'users') loadUsers();
  }

  // Load dashboard
  function loadDashboard() {
    loadStats();
    loadRecentOrders();
  }

  // Load statistics
  function loadStats() {
    Promise.all([
      FirebaseProducts.getAllProducts(),
      FirebaseOrders.getAllOrders()
    ])
      .then(([products, orders]) => {
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;

        const statsGrid = document.getElementById('statsGrid');
        statsGrid.innerHTML = `
          <div class="stat-card">
            <h3>Total Products</h3>
            <div class="value">${products.length}</div>
          </div>
          <div class="stat-card" style="border-left-color: var(--success);">
            <h3>Total Orders</h3>
            <div class="value">${orders.length}</div>
          </div>
          <div class="stat-card" style="border-left-color: var(--secondary);">
            <h3>Total Revenue</h3>
            <div class="value">$${totalRevenue.toFixed(2)}</div>
          </div>
          <div class="stat-card" style="border-left-color: var(--danger);">
            <h3>Pending Orders</h3>
            <div class="value">${pendingOrders}</div>
          </div>
        `;
      })
      .catch(err => showToast('Error loading stats: ' + err, 'error'));
  }

  // Load recent orders
  function loadRecentOrders() {
    FirebaseOrders.getAllOrders()
      .then(orders => {
        const tbody = document.getElementById('recentOrdersBody');
        tbody.innerHTML = '';
        
        orders.slice(-5).reverse().forEach(order => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.userId}</td>
            <td>$${order.total}</td>
            <td><span style="background: ${order.status === 'pending' ? 'var(--danger)' : 'var(--success)'}; color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">${order.status}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(err => showToast('Error loading orders: ' + err, 'error'));
  }

  // Load products
  function loadProducts() {
    FirebaseProducts.getAllProducts()
      .then(products => {
        const tbody = document.getElementById('productsBody');
        tbody.innerHTML = '';
        
        products.forEach(product => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${product.id.substring(0, 8)}...</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price}</td>
            <td>${product.stock}</td>
            <td>
              <div class="admin-actions">
                <button class="edit" onclick="editProduct('${product.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="deleteProduct('${product.id}')"><i class="fas fa-trash"></i></button>
              </div>
            </td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(err => showToast('Error loading products: ' + err, 'error'));
  }

  // Edit product
  window.editProduct = function(productId) {
    FirebaseProducts.getProduct(productId)
      .then(product => {
        currentProductId = productId;
        document.getElementById('productModalTitle').textContent = 'Edit Product';
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOriginalPrice').value = product.originalPrice;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productRating').value = product.rating;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productModal').classList.add('active');
      })
      .catch(err => showToast('Error loading product: ' + err, 'error'));
  };

  // Delete product
  window.deleteProduct = function(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
      FirebaseProducts.deleteProduct(productId)
        .then(() => {
          showToast('Product deleted successfully', 'success');
          loadProducts();
        })
        .catch(err => showToast('Error deleting product: ' + err, 'error'));
    }
  };

  // Open product modal
  function openProductModal() {
    currentProductId = null;
    document.getElementById('productModalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').classList.add('active');
  }

  // Close product modal
  function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
  }

  // Save product
  function saveProduct(e) {
    e.preventDefault();
    
    const productData = {
      name: document.getElementById('productName').value,
      category: document.getElementById('productCategory').value,
      price: parseFloat(document.getElementById('productPrice').value),
      originalPrice: parseFloat(document.getElementById('productOriginalPrice').value),
      stock: parseInt(document.getElementById('productStock').value),
      rating: parseFloat(document.getElementById('productRating').value),
      description: document.getElementById('productDescription').value,
      image: document.getElementById('productImage').value,
      discount: Math.round(((document.getElementById('productOriginalPrice').value - document.getElementById('productPrice').value) / document.getElementById('productOriginalPrice').value) * 100),
      reviewCount: 0,
      soldCount: 0,
      shippingInfo: 'Free Shipping',
      tags: []
    };

    const savePromise = currentProductId 
      ? FirebaseProducts.updateProduct(currentProductId, productData)
      : FirebaseProducts.addProduct(productData);

    savePromise
      .then(() => {
        showToast(currentProductId ? 'Product updated successfully' : 'Product added successfully', 'success');
        closeProductModal();
        loadProducts();
      })
      .catch(err => showToast('Error saving product: ' + err, 'error'));
  }

  // Load orders
  function loadOrders() {
    FirebaseOrders.getAllOrders()
      .then(orders => {
        const tbody = document.getElementById('ordersBody');
        tbody.innerHTML = '';
        
        orders.forEach(order => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.userId}</td>
            <td>$${order.total}</td>
            <td>
              <select onchange="updateOrderStatus('${order.orderId}', this.value)" style="padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px;">
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
              </select>
            </td>
            <td>
              <select onchange="updatePaymentStatus('${order.orderId}', this.value)" style="padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px;">
                <option value="pending" ${order.paymentStatus === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="completed" ${order.paymentStatus === 'completed' ? 'selected' : ''}>Completed</option>
              </select>
            </td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
              <button class="edit" onclick="viewOrder('${order.orderId}')"><i class="fas fa-eye"></i></button>
            </td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(err => showToast('Error loading orders: ' + err, 'error'));
  }

  // Update order status
  window.updateOrderStatus = function(orderId, status) {
    FirebaseOrders.updateOrderStatus(orderId, status)
      .then(() => {
        showToast('Order status updated', 'success');
      })
      .catch(err => showToast('Error updating order: ' + err, 'error'));
  };

  // Update payment status
  window.updatePaymentStatus = function(orderId, paymentStatus) {
    FirebaseOrders.updatePaymentStatus(orderId, paymentStatus)
      .then(() => {
        showToast('Payment status updated', 'success');
      })
      .catch(err => showToast('Error updating payment: ' + err, 'error'));
  };

  // View order
  window.viewOrder = function(orderId) {
    FirebaseOrders.getOrder(orderId)
      .then(order => {
        alert('Order Details:\n\nOrder ID: ' + order.orderId + '\nTotal: $' + order.total + '\nStatus: ' + order.status + '\nItems: ' + order.items.length);
      })
      .catch(err => showToast('Error loading order: ' + err, 'error'));
  };

  // Load users
  function loadUsers() {
    const { db } = window.firebaseServices;
    db.ref('users').once('value', snapshot => {
      const tbody = document.getElementById('usersBody');
      tbody.innerHTML = '';
      
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          const user = child.val();
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.email}</td>
            <td>${user.name}</td>
            <td><span style="background: ${user.role === 'admin' ? 'var(--primary)' : 'var(--secondary)'}; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">${user.role}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
              <button class="delete" onclick="deleteUser('${child.key}')"><i class="fas fa-trash"></i></button>
            </td>
          `;
          tbody.appendChild(row);
        });
      }
    });
  }

  // Delete user
  window.deleteUser = function(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
      const { db } = window.firebaseServices;
      db.ref('users/' + userId).remove()
        .then(() => {
          showToast('User deleted successfully', 'success');
          loadUsers();
        })
        .catch(err => showToast('Error deleting user: ' + err, 'error'));
    }
  };

  // Show toast notification
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    container.appendChild(toast);
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