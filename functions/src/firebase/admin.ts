// functions/src/firebase/admin.ts
import admin from 'firebase-admin';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
config({ path: path.resolve(process.cwd(), '.env') });

// This file is for SERVER-SIDE use only.
// It initializes the Firebase Admin SDK, which provides privileged access.

// Robust singleton pattern for serverless environments.
// This ensures the app is initialized only once per server instance.
if (!admin.apps.length) {
  try {
    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          // Replace escaped newlines before parsing
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log("Firebase Admin SDK initialized successfully using environment variables.");
    } else {
      console.warn("Firebase Admin SDK not initialized. Missing required environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).");
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
