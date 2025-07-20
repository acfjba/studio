// src/lib/firebase/config.ts

// This file is the central point for initializing the Firebase SDK for your application.
// It reads your project's specific credentials from the .env file.
// IMPORTANT: For Next.js, environment variables must be prefixed with NEXT_PUBLIC_ to be accessible in the browser.

import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// These variables are loaded from the .env file in your project's root directory.
// They MUST be prefixed with NEXT_PUBLIC_ to be exposed to the client-side application.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
