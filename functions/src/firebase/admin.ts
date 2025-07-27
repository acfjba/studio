// functions/src/firebase/admin.ts
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
config({ path: path.resolve(process.cwd(), '.env') });

// This file is for SERVER-SIDE use only.
// It initializes the Firebase Admin SDK, which provides privileged access.

let admin: typeof import('firebase-admin');
let adminAuth: import('firebase-admin/auth').Auth | null = null;
let adminDb: import('firebase-admin/firestore').Firestore | null = null;

// Dynamic import for firebase-admin to support both CJS and ESM environments
async function initializeFirebaseAdmin() {
  if (admin && admin.apps.length) {
    return;
  }
  
  admin = (await import('firebase-admin'));

  if (admin.apps.length === 0) {
    try {
      const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

      if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
        console.log("Firebase Admin SDK initialized successfully using environment variables.");
        adminAuth = admin.auth();
        adminDb = admin.firestore();
      } else {
        console.warn("Firebase Admin SDK not initialized. Missing required environment variables.");
      }
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
    }
  }
}

// Immediately invoke the async function. The exports will be populated when the promise resolves.
initializeFirebaseAdmin();

export { adminAuth, adminDb };

    