
// src/lib/firebase/config.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration.
// Next.js automatically handles loading environment variables prefixed with NEXT_PUBLIC_
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// A simple boolean check to confirm that the essential keys are present.
export const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (isFirebaseConfigured) {
    // Initialize Firebase
    // This pattern prevents re-initialization on hot reloads.
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);

    // Initialize App Check only on the client side where window is defined
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        try {
            initializeAppCheck(app, {
                provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
                isTokenAutoRefreshEnabled: true,
            });
        } catch (error) {
            console.error("Error initializing Firebase App Check:", error);
        }
    }
} else {
    console.warn("Firebase configuration is missing. The app will run in offline/read-only mode.");
}

// Export the initialized services, which may be undefined if not configured.
export { auth, db };
