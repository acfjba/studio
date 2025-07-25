// src/lib/firebase/config.ts
import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration, as provided.
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyD-L2Zx9FSDysCO6OypaaswfsQX4F4q73s",
  authDomain: "school-platform-kc9uh.firebaseapp.com",
  projectId: "school-platform-kc9uh",
  storageBucket: "school-platform-kc9uh.appspot.com",
  messagingSenderId: "840322255670",
  appId: "1:840322255670:web:98e2f0f3ef1774a850c197"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// isFirebaseConfigured is now always true since the config is hardcoded.
export const isFirebaseConfigured = true;

export { db, auth };
