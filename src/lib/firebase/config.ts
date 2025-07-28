// src/lib/firebase/config.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
// It's safe to expose this on the client side. Security is handled by Firestore Rules.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// A simple check to confirm that the configuration is not just placeholders
export const isFirebaseConfigured = !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("NEXT_PUBLIC_");

// Initialize Firebase App
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize and export Firebase services
const auth: Auth | null = isFirebaseConfigured ? getAuth(app) : null;
const db: Firestore | null = isFirebaseConfigured ? getFirestore(app) : null;
const storage: FirebaseStorage | null = isFirebaseConfigured ? getStorage(app) : null;

export { app, auth, db, storage };
