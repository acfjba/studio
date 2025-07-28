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
    console.log("Initializing Firebase Admin SDK...");
    admin.initializeApp({
        credential: applicationDefault(),
    });
     console.log("Firebase Admin SDK initialized successfully.");
  }
  
  // Get instances after initialization (or if already initialized)
  if (admin.apps.length > 0) {
      adminAuth = admin.auth();
      adminDb = admin.firestore();
  }

} catch (error) {
  console.error('Firebase admin initialization error:', error);
  console.log('Please ensure you have set up your GOOGLE_APPLICATION_CREDENTIALS environment variable to point to your service account key file.');
}

export { adminAuth, adminDb };
