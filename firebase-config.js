/**
 * firebase-config.js – Firebase initialization and setup
 */

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGEa_zotyl5bhDvEsVIPRe9QNRhOzFCTM",
  authDomain: "cartgodb.firebaseapp.com",
  projectId: "cartgodb",
  storageBucket: "cartgodb.firebasestorage.app",
  messagingSenderId: "469401845368",
  appId: "1:469401845368:web:dae2f89b8f519646d4b78d",
  measurementId: "G-ECJH22B1B0",
  databaseURL: "https://cartgodb-default-rtdb.firebaseio.com"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get references to services
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

// Export for use in other files
window.firebaseServices = { auth, db, storage };