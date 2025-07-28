
// functions/src/firebase/admin.ts
import { config } from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';

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

    // Prioritize explicit env vars, but fall back to applicationDefault (which uses GOOGLE_APPLICATION_CREDENTIALS)
    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
      console.log("Initializing Firebase Admin SDK using explicit environment variables.");
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
        console.log("Initializing Firebase Admin SDK using Application Default Credentials.");
        admin.initializeApp({
            credential: applicationDefault(),
        });
    }
  }
  
  // Get instances after initialization (or if already initialized)
  if (admin.apps.length > 0) {
      adminAuth = admin.auth();
      adminDb = admin.firestore();
  }

} catch (error) {
  console.error('Firebase admin initialization error:', error);
  console.log('Please ensure you have set up your GOOGLE_APPLICATION_CREDENTIALS environment variable or provided the specific FIREBASE_... variables in your .env file.');
}

export { adminAuth, adminDb };
