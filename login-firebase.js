/**
 * login-firebase.js – Firebase Authentication UI Logic
 */

(function() {
  'use strict';

  // DOM refs
  const tabs = document.querySelectorAll('#authTabs button');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginMessage = document.getElementById('loginMessage');
  const registerMessage = document.getElementById('registerMessage');
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');

  // Initialize
  function init() {
    checkAuth();
    setupEventListeners();
  }

  // Check if already logged in
  function checkAuth() {
    FirebaseAuth.getCurrentUser()
      .then(user => {
        if (user) {
          window.location.href = 'index-firebase.html';
        }
      });
  }

  // Setup event listeners
  function setupEventListeners() {
    // Tab switching
    tabs.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    switchToRegister.addEventListener('click', () => switchTab('register'));
    switchToLogin.addEventListener('click', () => switchTab('login'));

    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
  }

  // Switch tabs
  function switchTab(tabId) {
    tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
    loginForm.classList.toggle('active', tabId === 'login');
    registerForm.classList.toggle('active', tabId === 'register');
    loginMessage.textContent = '';
    loginMessage.className = 'auth-message';
    registerMessage.textContent = '';
    registerMessage.className = 'auth-message';
  }

  // Handle login
  function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    FirebaseAuth.signIn(email, password)
      .then(result => {
        if (result.success) {
          showMessage(loginMessage, '✅ Login successful! Redirecting...', 'success');
          showToast('Welcome back!', 'success');
          setTimeout(() => {
            window.location.href = 'index-firebase.html';
          }, 1000);
        }
      })
      .catch(err => {
        const message = err.code === 'auth/user-not-found' ? 'Email not found' :
                       err.code === 'auth/wrong-password' ? 'Incorrect password' :
                       err.message;
        showMessage(loginMessage, '❌ ' + message, 'error');
      });
  }

  // Handle register
  function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;

    if (password !== confirm) {
      showMessage(registerMessage, '❌ Passwords do not match', 'error');
      return;
    }

    FirebaseAuth.signUp(email, password, name)
      .then(result => {
        if (result.success) {
          showMessage(registerMessage, '✅ Account created! Redirecting...', 'success');
          showToast('Welcome to NovaMart!', 'success');
          setTimeout(() => {
            window.location.href = 'index-firebase.html';
          }, 1000);
        }
      })
      .catch(err => {
        const message = err.code === 'auth/email-already-in-use' ? 'Email already registered' :
                       err.code === 'auth/weak-password' ? 'Password too weak' :
                       err.message;
        showMessage(registerMessage, '❌ ' + message, 'error');
      });
  }

  // Show message
  function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `auth-message ${type}`;
  }

  // Show toast
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'error-circle'}"></i> ${message}`;
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