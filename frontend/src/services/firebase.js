import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyForGreenThumbLocalDevelopment123',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'greenthumb-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'greenthumb-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'greenthumb-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

let app;
let auth = null;
let storage = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase Client SDK initialization notice:', error.message);
}

export { app, auth, storage };
