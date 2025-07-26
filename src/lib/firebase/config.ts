
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
  appId: "1:840322255670:web:98e2f0f3ef1774a850c197",
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
let appCheck: AppCheck | undefined = undefined;

const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

// Initialize App Check only on the client side
if (typeof window !== "undefined" && isFirebaseConfigured) {
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (recaptchaSiteKey) {
        try {
            appCheck = initializeAppCheck(app, {
                provider: new ReCaptchaV3Provider(recaptchaSiteKey),
                isTokenAutoRefreshEnabled: true
            });
            console.log("App Check initialized successfully.");
        } catch(e) {
            console.error("App Check initialization error", e);
        }
    } else {
        console.warn("App Check not initialized. NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing.");
    }
}

export { app, auth, db, appCheck, isFirebaseConfigured };
