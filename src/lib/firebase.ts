import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// For production: Use environment variables (see VERCEL_DEPLOYMENT.md)
// For development: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBZY6bRbTGe1ndr4NvubaPfPLgMVCBXx94",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "monad-e19d8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "monad-e19d8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "monad-e19d8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "718099346874",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:718099346874:web:95b3addfe297b38dce1983"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
