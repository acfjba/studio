// functions/src/firebase/admin.ts
import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// This file is for SERVER-SIDE use only.
// It initializes the Firebase Admin SDK, which provides privileged access.

// Robust singleton pattern for serverless environments.
// This ensures the app is initialized only once per server instance.
if (!admin.apps.length) {
  try {
    // Check if the serviceAccountKey.json file exists for local development
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath) as ServiceAccount;
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin SDK initialized with local service account key.");
    } else {
        // Otherwise, use default credentials provided by the App Hosting environment
        admin.initializeApp();
        console.log("Firebase Admin SDK initialized with default App Hosting credentials.");
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
