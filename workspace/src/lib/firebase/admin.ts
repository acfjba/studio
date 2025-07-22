
// src/lib/firebase/admin.ts
import admin from 'firebase-admin';

// This file is for SERVER-SIDE use only.
// It initializes the Firebase Admin SDK, which provides privileged access.

// Robust initialization pattern for serverless environments like Firebase App Hosting.
// This ensures the app is initialized only once per instance.
if (!admin.apps.length) {
  try {
    // Note: The credentials are automatically sourced by Firebase App Hosting.
    // In a local environment, you would need to set up the GOOGLE_APPLICATION_CREDENTIALS
    // environment variable pointing to your service account key file.
    admin.initializeApp();
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    // We ignore the "already exists" error in development, as it can happen on hot reloads.
    if (!/already exists/u.test(error.message)) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
