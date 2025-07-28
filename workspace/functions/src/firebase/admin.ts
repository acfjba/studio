
// functions/src/firebase/admin.ts
import { config } from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';

// Load environment variables from the root .env file
config({ path: path.resolve(process.cwd(), '.env') });

// This file is for SERVER-SIDE use only.
// It initializes the Firebase Admin SDK, which provides privileged access.

let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;

// Initialize Firebase Admin SDK
try {
  if (admin.apps.length === 0) {
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
    } else {
      console.warn("Firebase Admin SDK not initialized. Missing required environment variables.");
    }
  }
  
  // Get instances after initialization (or if already initialized)
  if (admin.apps.length > 0) {
      adminAuth = admin.auth();
      adminDb = admin.firestore();
  }

} catch (error) {
  console.error('Firebase admin initialization error:', error);
}

export { adminAuth, adminDb };
