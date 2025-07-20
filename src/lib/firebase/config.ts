// src/lib/firebase/config.ts

// This file is the central point for initializing the Firebase SDK for your application.
// It reads your project's specific credentials from the .env file in the root directory.

import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// These variables are loaded from the .env file in your project's root directory.
// Make sure they are correctly set up there.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// This function checks if all the necessary Firebase configuration values are present.
// It helps prevent errors if the .env file is missing or incomplete.
function isAllConfigPresent() {
    return Object.values(firebaseConfig).every(val => val);
}

// Initialize Firebase only if it hasn't been initialized already.
// This is best practice to avoid re-initializing the app on every hot-reload in development.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Conditionally initialize Firestore. If the configuration is not fully present,
// db will be null, and the application will show a "Firebase not configured" message.
const db = isAllConfigPresent() ? getFirestore(app) : null;

// Export a boolean that can be used throughout the app to check if Firebase is connected.
export const isFirebaseConfigured = isAllConfigPresent();

// Export the Firestore database instance to be used for all database operations.
export { db };
