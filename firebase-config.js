/**
 * firebase-config.js — Firebase initialization for NovaMart Global
 *
 * Load order in every HTML page that needs Firebase (this order matters):
 *   1. https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js
 *   2. https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js
 *   3. https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js   (optional)
 *   4. https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js
 *   5. firebase-config.js  <-- this file
 *   6. products.js
 *   7. store-sync.js
 *   8. auth.js / cart.js / wishlist.js / app.js (or the page's own script)
 *
 * This exposes three globals other scripts can use:
 *   window.firebaseAuth  -> firebase.auth()
 *   window.firebaseDb    -> firebase.firestore()  (if you use Firestore elsewhere)
 *   window.firebaseRtdb  -> firebase.database()   (used by store-sync.js / admin.html)
 */
(function () {
  'use strict';

  const firebaseConfig = {
    apiKey: "AIzaSyAGEa_zotyl5bhDvEsVIPRe9QNRhOzFCTM",
    authDomain: "cartgodb.firebaseapp.com",
    databaseURL: "https://cartgodb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cartgodb",
    storageBucket: "cartgodb.firebasestorage.app",
    messagingSenderId: "469401845368",
    appId: "1:469401845368:web:dae2f89b8f519646d4b78d",
    measurementId: "G-ECJH22B1B0"
  };

  if (!window.firebase) {
    console.error('[NovaMart] Firebase SDK not found. Add the firebase compat <script> tags BEFORE firebase-config.js.');
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  window.firebaseAuth = firebase.auth ? firebase.auth() : null;
  window.firebaseDb = firebase.firestore ? firebase.firestore() : null;
  window.firebaseRtdb = firebase.database ? firebase.database() : null;

  if (!window.firebaseRtdb) {
    console.error('[NovaMart] Realtime Database SDK not loaded — add firebase-database-compat.js before this file.');
  }
})();
