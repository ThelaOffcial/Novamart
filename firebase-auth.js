/**
 * firebase-auth.js – Firebase Authentication Module
 */

const FirebaseAuth = (function() {
  const { auth, db } = window.firebaseServices;

  // Sign Up
  function signUp(email, password, name) {
    return new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          // Store user data in Realtime DB
          db.ref('users/' + user.uid).set({
            uid: user.uid,
            email: email,
            name: name,
            createdAt: new Date().toISOString(),
            role: 'customer',
            avatar: ''
          }).then(() => {
            resolve({ success: true, user });
          }).catch(err => reject(err));
        })
        .catch(error => reject(error));
    });
  }

  // Sign In
  function signIn(email, password) {
    return new Promise((resolve, reject) => {
      auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          resolve({ success: true, user: userCredential.user });
        })
        .catch(error => reject(error));
    });
  }

  // Sign Out
  function signOut() {
    return new Promise((resolve, reject) => {
      auth.signOut()
        .then(() => resolve({ success: true }))
        .catch(error => reject(error));
    });
  }

  // Get current user
  function getCurrentUser() {
    return new Promise((resolve) => {
      auth.onAuthStateChanged(user => {
        resolve(user);
      });
    });
  }

  // Get user profile
  function getUserProfile(uid) {
    return new Promise((resolve, reject) => {
      db.ref('users/' + uid).once('value', snapshot => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject('User not found');
        }
      }).catch(err => reject(err));
    });
  }

  // Update user profile
  function updateProfile(uid, data) {
    return new Promise((resolve, reject) => {
      db.ref('users/' + uid).update(data)
        .then(() => resolve({ success: true }))
        .catch(err => reject(err));
    });
  }

  // Check if user is admin
  function isAdmin(uid) {
    return new Promise((resolve) => {
      getUserProfile(uid)
        .then(profile => resolve(profile.role === 'admin'))
        .catch(() => resolve(false));
    });
  }

  return {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    getUserProfile,
    updateProfile,
    isAdmin
  };
})();