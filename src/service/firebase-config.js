// Import Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaC-9wFUX3eVO9gYpYimZURhAsYpasHAw",
  authDomain: "roku-dashboard-22967.firebaseapp.com",
  projectId: "roku-dashboard-22967",
  storageBucket: "roku-dashboard-22967.firebasestorage.app",
  messagingSenderId: "1021783431340",
  appId: "1:1021783431340:web:9457f9b0f582cf45d56709"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore and Storage instances
const db = getFirestore(app);


export { db, collection, addDoc, getDocs };
