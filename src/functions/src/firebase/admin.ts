
// functions/src/firebase/admin.ts
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// This file is for SERVER-SIDE use only.
// It initializes the Firebase Admin SDK, which provides privileged access.

// Robust singleton pattern for serverless environments.
// This ensures the app is initialized only once per server instance.
if (!admin.apps.length) {
  try {
    // Check for local service account key first.
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath) as ServiceAccount;
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin SDK initialized with local service account key.");
    } else if (process.env.GCLOUD_PROJECT) {
        // Fallback to default credentials in a deployed environment.
        admin.initializeApp();
        console.log("Firebase Admin SDK initialized with default App Hosting credentials.");
    } else {
        // Only log this if neither method works.
        console.warn("Firebase Admin SDK not initialized. Missing serviceAccountKey.json and GCLOUD_PROJECT env var.");
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
