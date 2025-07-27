
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

const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp;
if (typeof window !== 'undefined') { // Ensure this runs only on the client
    if (!getApps().length) {
        if (isFirebaseConfigured) {
            app = initializeApp(firebaseConfig);
        } else {
            console.error("Firebase config is missing. App cannot be initialized.");
            // Provide a dummy app object to prevent crashes
            app = {} as FirebaseApp;
        }
    } else {
        app = getApp();
    }
} else {
    // For server-side rendering, we might not need the client app.
    // The admin SDK is used for server-side operations (like seeding).
    app = getApps().length ? getApp() : ({} as FirebaseApp);
}


const auth: Auth = isFirebaseConfigured ? getAuth(app) : {} as Auth;
const db: Firestore = isFirebaseConfigured ? getFirestore(app) : {} as Firestore;
let appCheck: AppCheck | undefined = undefined;

// Initialize App Check only on the client side
if (typeof window !== "undefined" && isFirebaseConfigured) {
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (recaptchaSiteKey) {
        try {
            appCheck = initializeAppCheck(app, {
                provider: new ReCaptchaV3Provider(recaptchaSiteKey),
                isTokenAutoRefreshEnabled: true
            });
        } catch(e) {
            console.error("App Check initialization error", e);
        }
    } else {
        console.warn("App Check not initialized. NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing.");
    }
}

export { app, auth, db, appCheck, isFirebaseConfigured };
