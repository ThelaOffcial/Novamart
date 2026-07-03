/**
 * firebase-orders.js – Order Management Module
 */

const FirebaseOrders = (function() {
  const { db } = window.firebaseServices;

  // Create order
  function createOrder(userId, items, total, shippingAddress, paymentMethod = 'credit_card') {
    return new Promise((resolve, reject) => {
      const orderId = db.ref('orders').push().key;
      const orderData = {
        orderId: orderId,
        userId: userId,
        items: items,
        total: total,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentStatus: 'pending'
      };
      
      db.ref('orders/' + orderId).set(orderData)
        .then(() => {
          // Also save order reference in user's orders
          db.ref('users/' + userId + '/orders/' + orderId).set(true);
          resolve({ success: true, orderId, order: orderData });
        })
        .catch(err => reject(err));
    });
  }

  // Get user orders
  function getUserOrders(userId) {
    return new Promise((resolve, reject) => {
      db.ref('orders').orderByChild('userId').equalTo(userId).once('value', snapshot => {
        const orders = [];
        if (snapshot.exists()) {
          snapshot.forEach(child => {
            orders.push({ id: child.key, ...child.val() });
          });
        }
        resolve(orders);
      }).catch(err => reject(err));
    });
  }

  // Get all orders (Admin only)
  function getAllOrders() {
    return new Promise((resolve, reject) => {
      db.ref('orders').once('value', snapshot => {
        const orders = [];
        if (snapshot.exists()) {
          snapshot.forEach(child => {
            orders.push({ id: child.key, ...child.val() });
          });
        }
        resolve(orders);
      }).catch(err => reject(err));
    });
  }

  // Get order by ID
  function getOrder(orderId) {
    return new Promise((resolve, reject) => {
      db.ref('orders/' + orderId).once('value', snapshot => {
        if (snapshot.exists()) {
          resolve({ id: snapshot.key, ...snapshot.val() });
        } else {
          reject('Order not found');
        }
      }).catch(err => reject(err));
    });
  }

  // Update order status (Admin only)
  function updateOrderStatus(orderId, status) {
    return new Promise((resolve, reject) => {
      db.ref('orders/' + orderId).update({
        status: status,
        updatedAt: new Date().toISOString()
      }).then(() => {
        resolve({ success: true });
      }).catch(err => reject(err));
    });
  }

  // Update payment status
  function updatePaymentStatus(orderId, paymentStatus) {
    return new Promise((resolve, reject) => {
      db.ref('orders/' + orderId).update({
        paymentStatus: paymentStatus,
        updatedAt: new Date().toISOString()
      }).then(() => {
        resolve({ success: true });
      }).catch(err => reject(err));
    });
  }

  // Listen to order updates in real-time
  function listenToOrder(orderId, callback) {
    db.ref('orders/' + orderId).on('value', snapshot => {
      if (snapshot.exists()) {
        callback({ id: snapshot.key, ...snapshot.val() });
      }
    });
  }

  // Stop listening to order updates
  function stopListeningToOrder(orderId) {
    db.ref('orders/' + orderId).off();
  }

  // Listen to user orders in real-time
  function listenToUserOrders(userId, callback) {
    db.ref('orders').orderByChild('userId').equalTo(userId).on('value', snapshot => {
      const orders = [];
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          orders.push({ id: child.key, ...child.val() });
        });
      }
      callback(orders);
    });
  }

  return {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrder,
    updateOrderStatus,
    updatePaymentStatus,
    listenToOrder,
    stopListeningToOrder,
    listenToUserOrders
  };
})();