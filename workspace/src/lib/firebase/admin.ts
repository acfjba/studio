
// src/lib/firebase/admin.ts
import admin from 'firebase-admin';

// This file is for SERVER-SIDE use only.
// It initializes the Firebase Admin SDK, which provides privileged access.

if (!admin.apps.length) {
  try {
    // Note: The credentials are automatically sourced by App Hosting.
    // In a local environment, you would need to set up the GOOGLE_APPLICATION_CREDENTIALS
    // environment variable pointing to your service account key file.
    admin.initializeApp();
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
