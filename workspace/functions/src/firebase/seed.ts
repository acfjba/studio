
// functions/src/firebase/seed.ts
import { adminDb, adminAuth } from './admin';
import authUsers from '../data/auth_users.json';
import firestoreSeed from '../data/firestore_seed.json';

/**
 * Seeds Firebase Authentication with users from a JSON file.
 */
async function seedAuth() {
  console.log("Seeding Authentication...");
  if (!adminAuth) {
    console.error("✘ Firebase Auth not initialized. Skipping auth seeding.");
    return;
  }
  for (const user of authUsers) {
    try {
      // Ensure UID is provided, as it's required by the createUser method
      const { uid, ...restOfUser } = user;
       if (!uid) {
        console.error(`✘ Skipping user with email ${user.email} due to missing UID.`);
        continue;
      }
      await adminAuth.createUser({ uid, ...restOfUser });
      console.log(`✔ Auth user created: ${user.email}`);
    } catch (err: any) {
      if (err.code === 'auth/uid-already-exists') {
        console.log(`✔ Auth user already exists: ${user.email}`);
      } else {
        console.error(`✘ Failed to create auth user ${user.email}:`, err.message);
      }
    }
  }
}

/**
 * Seeds Firestore with data from a JSON file.
 */
async function seedFirestore() {
  console.log("Seeding Firestore...");
  if (!adminDb) {
    console.error("✘ Firestore not initialized. Skipping Firestore seeding.");
    return;
  }
  for (const entry of firestoreSeed) {
    try {
      if (!entry.collection || !entry.doc || !entry.data) {
          console.error(`✘ Skipping invalid Firestore entry:`, entry);
          continue;
      }
      await adminDb.collection(entry.collection).doc(entry.doc).set(entry.data);
      console.log(`✔ Firestore doc created/updated: ${entry.collection}/${entry.doc}`);
    } catch (err: any) {
      console.error(`✘ Failed to create Firestore doc ${entry.collection}/${entry.doc}:`, err.message);
    }
  }
}

/**
 * Main function to run the seeding process for both Auth and Firestore.
 */
export async function seedDatabase() {
  console.log("Starting database seed process...");
  await seedAuth();
  await seedFirestore();
  console.log("📦 Seeding complete.");
}
