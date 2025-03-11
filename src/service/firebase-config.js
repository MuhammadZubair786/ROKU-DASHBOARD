// Import Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiL-RgJ0n8-C7Z_46J9i5VNOfBM_hFOSA",
  authDomain: "sky-resource-form.firebaseapp.com",
  projectId: "sky-resource-form",
  storageBucket: "sky-resource-form.appspot.com", // Fixed storageBucket URL
  messagingSenderId: "336317455241",
  appId: "1:336317455241:web:7a6f0ac3dfdea9a60f9f58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore and Storage instances
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
