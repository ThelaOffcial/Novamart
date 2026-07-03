/**
 * auth.js – User authentication with localStorage
 */
const Auth = (function() {
  const USERS_KEY = 'novamart_users';
  const CURRENT_USER_KEY = 'novamart_current_user';

  // Get all users
  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  }

  // Save users
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // Get current logged-in user
  function getCurrentUser() {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (!email) return null;
    const users = getUsers();
    return users.find(u => u.email === email) || null;
  }

  // Check if logged in
  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  // Register new user
  function signUp(name, email, password, confirmPassword) {
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const newUser = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password, // In production, hash this!
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    // Auto-login after signup
    localStorage.setItem(CURRENT_USER_KEY, newUser.email);
    return { success: true, user: newUser };
  }

  // Login
  function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email.trim().toLowerCase() && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }
    localStorage.setItem(CURRENT_USER_KEY, user.email);
    return { success: true, user };
  }

  // Logout
  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // Update profile (name, picture placeholder)
  function updateProfile(name) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'Not logged in.' };
    const users = getUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index === -1) return { success: false, message: 'User not found.' };
    users[index].name = name.trim();
    saveUsers(users);
    // Update current session
    localStorage.setItem(CURRENT_USER_KEY, users[index].email);
    return { success: true, user: users[index] };
  }

  return {
    getUsers,
    saveUsers,
    getCurrentUser,
    isLoggedIn,
    signUp,
    login,
    logout,
    updateProfile
  };
})();