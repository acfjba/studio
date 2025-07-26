
// src/lib/firebase/config.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This check is the key to preventing initialization errors.
export const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let appCheck: AppCheck | undefined = undefined;

if (isFirebaseConfigured) {
  // Initialize Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);

  // Initialize App Check only on the client side
  if (typeof window !== "undefined") {
    // Check if NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set
    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
            isTokenAutoRefreshEnabled: true
        });
    } else {
        console.warn("App Check not initialized. NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing.");
    }
  }

} else {
  console.warn("Firebase configuration is missing or incomplete. Firebase services will be unavailable.");
}

export { app, auth, db, appCheck };
