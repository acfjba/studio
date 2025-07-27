// src/lib/firebase/config.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyD-L2Zx9FSDysCO6OypaaswfsQX4F4q73s",
  authDomain: "school-platform-kc9uh.firebaseapp.com",
  projectId: "school-platform-kc9uh",
  storageBucket: "school-platform-kc9uh.appspot.com",
  messagingSenderId: "840322255670",
  appId: "1:840322255670:web:98e2f0f3ef1774a850c197"
};

// A simple check to see if the placeholder values have been replaced.
const isFirebaseConfigured = !!(
    firebaseConfig.apiKey && 
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.startsWith("YOUR_") &&
    !firebaseConfig.projectId.startsWith("YOUR_")
);

let app: FirebaseApp;
if (typeof window !== 'undefined') { // Ensure this runs only on the client
    if (!getApps().length) {
        if (isFirebaseConfigured) {
            app = initializeApp(firebaseConfig);
        } else {
            console.error("Firebase config is missing. App cannot be initialized.");
            // Provide a dummy app object to prevent crashes on the server
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
    // Hardcoding a placeholder for the reCAPTCHA key as it's part of the same problem.
    const recaptchaSiteKey = "YOUR_RECAPTCHA_SITE_KEY"; 
    if (recaptchaSiteKey && recaptchaSiteKey !== "YOUR_RECAPTCHA_SITE_KEY") {
        try {
            appCheck = initializeAppCheck(app, {
                provider: new ReCaptchaV3Provider(recaptchaSiteKey),
                isTokenAutoRefreshEnabled: true
            });
        } catch(e) {
            console.error("App Check initialization error", e);
        }
    } else {
        console.warn("App Check not initialized. Recaptcha Site Key is missing or is a placeholder.");
    }
}

export { app, auth, db, appCheck, isFirebaseConfigured };
