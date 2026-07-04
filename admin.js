/**
 * admin.js – Admin Dashboard Logic
 */

(function() {
  'use strict';

  let currentUser = null;
  let currentProductId = null;
  let currentUserSubtab = 'all';
  let cachedProducts = []; // used for client-side product search filtering
  const LOW_STOCK_THRESHOLD = 5;

  // Order tracking stages, in order
  const ORDER_STAGES = [
    { key: 'pending', label: 'Pending' },
    { key: 'packing', label: 'Packing' },
    { key: 'in_delivery', label: 'In Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  function stageLabel(key) {
    if (key === 'cancelled') return 'Cancelled';
    if (key === 'processing') key = 'packing';
    if (key === 'shipped') key = 'in_delivery';
    const stage = ORDER_STAGES.find(s => s.key === key) || ORDER_STAGES.find(s => s.key === 'pending');
    return stage.label;
  }

  function stageIndex(key) {
    const idx = ORDER_STAGES.findIndex(s => s.key === key);
    return idx === -1 ? 0 : idx;
  }

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
    document.getElementById('productSearchInput')?.addEventListener('input', (e) => filterProducts(e.target.value));

    // Order detail modal
    document.getElementById('closeOrderDetailModal')?.addEventListener('click', () => {
      document.getElementById('orderDetailModal').classList.remove('active');
    });

    // Users sub-tabs (All Users / Sellers)
    document.querySelectorAll('.user-subtab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.user-subtab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentUserSubtab = btn.dataset.role;
        document.getElementById('sellerNote').style.display = currentUserSubtab === 'seller' ? 'block' : 'none';
        loadUsers();
      });
    });

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
    loadNewOrders();
    loadLowStock();
    loadRecentOrders();
  }

  // Load products running low on stock so restocking doesn't get missed
  function loadLowStock() {
    FirebaseProducts.getAllProducts()
      .then(products => {
        const lowStock = products
          .filter(p => p.stock <= LOW_STOCK_THRESHOLD)
          .sort((a, b) => a.stock - b.stock);

        const countBadge = document.getElementById('lowStockCount');
        if (countBadge) countBadge.textContent = lowStock.length;

        const tbody = document.getElementById('lowStockBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (lowStock.length === 0) {
          tbody.innerHTML = '<tr><td colspan="3" class="empty-note">All products are well stocked.</td></tr>';
          return;
        }

        lowStock.forEach(product => {
          const row = document.createElement('tr');
          const stockClass = product.stock === 0 ? 'stock-out' : 'stock-low';
          row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td class="${stockClass}">${product.stock === 0 ? 'Out of stock' : product.stock + ' left'}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(err => showToast('Error loading stock levels: ' + err, 'error'));
  }

  // Load new (pending) orders and show them at the top of the dashboard
  function loadNewOrders() {
    FirebaseOrders.getAllOrders()
      .then(orders => {
        const newOrders = orders
          .filter(o => o.status === 'pending')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const countBadge = document.getElementById('newOrdersCount');
        if (countBadge) countBadge.textContent = newOrders.length;

        const tbody = document.getElementById('newOrdersBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (newOrders.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" class="empty-note">No new orders right now — you\'re all caught up.</td></tr>';
          return;
        }

        newOrders.forEach(order => {
          const row = document.createElement('tr');
          row.className = 'row--new';
          row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.userId}</td>
            <td>$${order.total}</td>
            <td><span class="new-badge">NEW</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(err => showToast('Error loading new orders: ' + err, 'error'));
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
          const statusColor = order.status === 'pending' ? 'var(--danger)'
            : order.status === 'cancelled' ? 'var(--text-secondary)'
            : 'var(--success)';
          row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.userId}</td>
            <td>$${order.total}</td>
            <td><span style="background: ${statusColor}; color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">${order.status}</span></td>
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
        cachedProducts = products;
        renderProductsTable(products);
      })
      .catch(err => showToast('Error loading products: ' + err, 'error'));
  }

  // Render a given list of products into the products table (used by search filter)
  function renderProductsTable(products) {
    const tbody = document.getElementById('productsBody');
    tbody.innerHTML = '';

    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color: var(--text-secondary);">No products match your search.</td></tr>';
      return;
    }

    products.forEach(product => {
      const forSale = product.forSale !== false; // default to true if unset
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.id.substring(0, 8)}...</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>$${product.price}</td>
        <td>${product.stock}</td>
        <td>
          <span class="badge ${forSale ? 'badge--onsale' : 'badge--off'}" title="Click to toggle" onclick="toggleProductSale('${product.id}', ${forSale})">
            ${forSale ? 'On Sale' : 'Not Listed'}
          </span>
        </td>
        <td>
          <div class="admin-actions">
            <button class="edit" onclick="editProduct('${product.id}')"><i class="fas fa-edit"></i></button>
            <button class="delete" onclick="deleteProduct('${product.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // Filter the cached product list by name/category as the admin types
  function filterProducts(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      renderProductsTable(cachedProducts);
      return;
    }
    const filtered = cachedProducts.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
    renderProductsTable(filtered);
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
        document.getElementById('productForSale').checked = product.forSale !== false;
        document.getElementById('productModal').classList.add('active');
      })
      .catch(err => showToast('Error loading product: ' + err, 'error'));
  };

  // Toggle whether a product is currently listed for sale
  window.toggleProductSale = function(productId, currentlyForSale) {
    FirebaseProducts.updateProduct(productId, { forSale: !currentlyForSale })
      .then(() => {
        showToast(!currentlyForSale ? 'Product is now listed for sale' : 'Product removed from sale', 'success');
        loadProducts();
      })
      .catch(err => showToast('Error updating product: ' + err, 'error'));
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
    document.getElementById('productForSale').checked = true;
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
      forSale: document.getElementById('productForSale').checked,
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
          // Normalize legacy status values onto the new stage track
          let status = order.status;
          if (status === 'processing') status = 'packing';
          if (status === 'shipped') status = 'in_delivery';

          const row = document.createElement('tr');

          if (status === 'cancelled') {
            row.innerHTML = `
              <td>${order.orderId}</td>
              <td>${order.userId}</td>
              <td>$${order.total}</td>
              <td><span class="stage-pill cancelled">Cancelled</span></td>
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
            return;
          }

          const idx = stageIndex(status);
          const nextStage = ORDER_STAGES[idx + 1];

          const stagePills = ORDER_STAGES.map((s, i) => {
            let cls = 'stage-pill';
            if (i < idx) cls += ' done';
            else if (i === idx) cls += (s.key === 'delivered' ? ' delivered' : ' done');
            return `<span class="${cls}">${s.label}</span>`;
          }).join('');

          const nextBtn = nextStage
            ? `<button class="btn--stage" onclick="advanceOrderStage('${order.orderId}', '${status}')">Move to ${nextStage.label} →</button>`
            : `<button class="btn--stage" disabled>Delivered ✓</button>`;

          const cancelBtn = status === 'delivered'
            ? ''
            : `<button class="btn--stage-cancel" onclick="cancelOrder('${order.orderId}')">Cancel Order</button>`;

          row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.userId}</td>
            <td>$${order.total}</td>
            <td>
              <div class="stage-track">${stagePills}</div>
              <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">${nextBtn}${cancelBtn}</div>
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

  // Move an order forward to its next tracking stage (Pending -> Packing -> In Delivery -> Delivered)
  window.advanceOrderStage = function(orderId, currentStatus) {
    const idx = stageIndex(currentStatus);
    const next = ORDER_STAGES[idx + 1];
    if (!next) return;

    FirebaseOrders.updateOrderStatus(orderId, next.key)
      .then(() => {
        showToast(`Order marked as "${next.label}"`, 'success');
        loadOrders();
        loadNewOrders();
      })
      .catch(err => showToast('Error updating order: ' + err, 'error'));
  };

  // Cancel an order
  window.cancelOrder = function(orderId) {
    if (!confirm('Cancel this order? This cannot be undone from here.')) return;
    FirebaseOrders.updateOrderStatus(orderId, 'cancelled')
      .then(() => {
        showToast('Order cancelled', 'success');
        loadOrders();
        loadNewOrders();
      })
      .catch(err => showToast('Error cancelling order: ' + err, 'error'));
  };

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

  // View order — shows a proper detail modal instead of a plain alert
  window.viewOrder = function(orderId) {
    FirebaseOrders.getOrder(orderId)
      .then(order => {
        const items = Array.isArray(order.items) ? order.items : [];

        const itemsHtml = items.length
          ? items.map(item => {
              const name = item.name || item.productName || `Product ${item.productId || ''}`;
              const qty = item.quantity || item.qty || 1;
              const price = typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : '';
              return `
                <div class="order-detail-item">
                  <span>${name} ${qty > 1 ? `× ${qty}` : ''}</span>
                  <span>${price}</span>
                </div>
              `;
            }).join('')
          : '<div class="order-detail-item"><span>No item details available</span></div>';

        const addr = order.shippingAddress;
        const addrHtml = addr
          ? (typeof addr === 'string'
              ? addr
              : [addr.name, addr.line1 || addr.address, addr.city, addr.state, addr.zip || addr.postalCode, addr.country]
                  .filter(Boolean).join(', '))
          : 'Not provided';

        const body = document.getElementById('orderDetailBody');
        body.innerHTML = `
          <div class="order-detail-section">
            <h4>Order Info</h4>
            <div class="order-detail-item"><span>Order ID</span><span>${order.orderId}</span></div>
            <div class="order-detail-item"><span>Customer</span><span>${order.userId}</span></div>
            <div class="order-detail-item"><span>Placed On</span><span>${new Date(order.createdAt).toLocaleString()}</span></div>
            <div class="order-detail-item"><span>Status</span><span>${stageLabel(order.status)}</span></div>
            <div class="order-detail-item"><span>Payment</span><span>${order.paymentMethod || 'N/A'} — ${order.paymentStatus}</span></div>
          </div>
          <div class="order-detail-section">
            <h4>Shipping Address</h4>
            <div class="order-detail-item"><span>${addrHtml}</span></div>
          </div>
          <div class="order-detail-section">
            <h4>Items (${items.length})</h4>
            ${itemsHtml}
            <div class="order-detail-total"><span>Total</span><span>$${order.total}</span></div>
          </div>
        `;
        document.getElementById('orderDetailModal').classList.add('active');
      })
      .catch(err => showToast('Error loading order: ' + err, 'error'));
  };

  // Load users (optionally filtered to sellers only via currentUserSubtab)
  function loadUsers() {
    const { db } = window.firebaseServices;
    db.ref('users').once('value', snapshot => {
      const tbody = document.getElementById('usersBody');
      tbody.innerHTML = '';

      let sellerCount = 0;
      const rows = [];

      if (snapshot.exists()) {
        snapshot.forEach(child => {
          const user = child.val();
          if (user.role === 'seller') sellerCount++;
          if (currentUserSubtab === 'seller' && user.role !== 'seller') return;

          const roleClass = user.role === 'admin' ? 'badge--role-admin'
            : user.role === 'seller' ? 'badge--role-seller'
            : 'badge--role-user';

          const sellerToggleBtn = user.role === 'admin'
            ? ''
            : user.role === 'seller'
              ? `<button class="edit" title="Remove seller status" onclick="toggleSellerRole('${child.key}', 'seller')"><i class="fas fa-store-slash"></i></button>`
              : `<button class="edit" title="Promote to seller" onclick="toggleSellerRole('${child.key}', 'customer')"><i class="fas fa-store"></i></button>`;

          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.email}</td>
            <td>${user.name}</td>
            <td><span class="badge ${roleClass}">${user.role}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
              <div class="admin-actions">
                ${sellerToggleBtn}
                <button class="delete" onclick="deleteUser('${child.key}')"><i class="fas fa-trash"></i></button>
              </div>
            </td>
          `;
          rows.push(row);
        });
      }

      const sellerCountEl = document.getElementById('sellerCount');
      if (sellerCountEl) sellerCountEl.textContent = sellerCount;

      if (rows.length === 0) {
        const emptyRow = document.createElement('tr');
        const message = currentUserSubtab === 'seller'
          ? 'No sellers have registered yet.'
          : 'No users found.';
        emptyRow.innerHTML = `<td colspan="5" style="color: var(--text-secondary); text-align:center;">${message}</td>`;
        tbody.appendChild(emptyRow);
      } else {
        rows.forEach(r => tbody.appendChild(r));
      }
    });
  }

  // Promote a customer to seller, or demote a seller back to customer
  window.toggleSellerRole = function(uid, currentRole) {
    const newRole = currentRole === 'seller' ? 'customer' : 'seller';
    const confirmMsg = newRole === 'seller'
      ? 'Promote this user to Seller? They will appear in the Sellers list.'
      : 'Remove seller status from this user?';
    if (!confirm(confirmMsg)) return;

    FirebaseAuth.updateProfile(uid, { role: newRole })
      .then(() => {
        showToast(newRole === 'seller' ? 'User promoted to Seller' : 'Seller status removed', 'success');
        loadUsers();
      })
      .catch(err => showToast('Error updating role: ' + err, 'error'));
  };

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