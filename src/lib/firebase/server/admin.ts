// src/lib/firebase/server/admin.ts
import admin from 'firebase-admin';

// This file is for SERVER-SIDE use only.
// It initializes the Firebase Admin SDK, which provides privileged access.

// Robust singleton pattern for serverless environments.
// This ensures the app is initialized only once per server instance.
if (!admin.apps.length) {
  try {
    // The credentials are automatically sourced by Firebase App Hosting.
    // In a local environment, set up the GOOGLE_APPLICATION_CREDENTIALS
    // environment variable pointing to your service account key file.
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
