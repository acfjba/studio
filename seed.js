
// seed.js
// Node.js script to seed Firebase Authentication and Firestore

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const authUsers = require("./auth_users.json");
const firestoreSeed = require("./firestore_seed.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

async function seedAuth() {
  console.log("Seeding Firebase Authentication...");
  for (const user of authUsers) {
    try {
      // Check if user exists by UID
      await admin.auth().getUser(user.uid);
      console.log(`~ Auth user ${user.email} already exists. Skipping creation.`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        // User doesn't exist, so create them
        try {
          await admin.auth().createUser({
            uid: user.uid,
            email: user.email,
            password: user.password,
            displayName: user.displayName,
            disabled: user.disabled
          });
          console.log(`✔ Auth user created: ${user.email}`);
        } catch (createErr) {
          console.error(`✘ Failed to create auth user ${user.email}: ${createErr.message}`);
        }
      } else {
        // Another error occurred
        console.error(`✘ Error checking auth user ${user.email}: ${err.message}`);
      }
    }
  }
}

async function seedFirestore() {
  console.log("Seeding Firestore...");
  const batch = db.batch();
  for (const entry of firestoreSeed) {
      const docRef = db.collection(entry.collection).doc(entry.doc);
      batch.set(docRef, entry.data);
  }
  try {
      await batch.commit();
      console.log(`✔ Firestore batch commit successful for ${firestoreSeed.length} documents.`);
  } catch(err) {
      console.error(`✘ Failed to commit Firestore batch: ${err.message}`);
  }
}

async function main() {
  await seedAuth();
  await seedFirestore();
  console.log("Seeding completed.");
}

main().catch(console.error);
