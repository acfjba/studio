// src/lib/firebase/admin.ts
import admin from 'firebase-admin';

// This file is for SERVER-SIDE use only.
// It initializes the Firebase Admin SDK, which provides privileged access.

// IMPORTANT: In a real production environment, you would use environment variables
// to store your service account credentials, and you would NOT commit the JSON file
// to your repository. For this demonstration, we are simplifying the process.
// Example for production:
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

// For local development, you might use a file, but ensure it's in .gitignore
try {
  if (!admin.apps.length) {
    // Note: The credentials are automatically sourced by App Hosting.
    // In a local environment, you would need to set up the GOOGLE_APPLICATION_CREDENTIALS
    // environment variable pointing to your service account key file.
    admin.initializeApp();
  }
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
