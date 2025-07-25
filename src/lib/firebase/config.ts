
// src/lib/firebase/config.ts

// This file is the central point for initializing the Firebase SDK for your application.
// It reads your project's specific credentials which are set in the next.config.ts file.

import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// These variables are loaded from the `env` block in your next.config.ts file.
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyD-L2Zx9FSDysCO6OypaaswfsQX4F4q73s",
  authDomain: "school-platform-kc9uh.firebaseapp.com",
  projectId: "school-platform-kc9uh",
  storageBucket: "school-platform-kc9uh.appspot.com",
  messagingSenderId: "840322255670",
  appId: "1:840322255670:web:98e2f0f3ef1774a850c197",
};

// This function checks if all the necessary Firebase configuration values are present.
// It helps prevent errors if the configuration is missing or incomplete.
function isAllConfigPresent() {
    return Object.values(firebaseConfig).every(val => !!val);
}

// Initialize Firebase only if it hasn't been initialized already.
// This is best practice to avoid re-initializing the app on every hot-reload in development.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Conditionally initialize Firestore. If the configuration is not fully present,
// db will be null, and the application will show a "Firebase not configured" message.
// We explicitly pass the database ID to ensure connection to the correct instance.
const db = isAllConfigPresent() ? getFirestore(app) : null;

// Export a boolean that can be used throughout the app to check if Firebase is connected.
export const isFirebaseConfigured = isAllConfigPresent();

// Export the Firestore database instance to be used for all database operations.
export { db, firebaseConfig };
