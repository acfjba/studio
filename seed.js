// seed.js - simplified
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const authUsers = require("./auth_users.json");
const firestoreSeed = require("./firestore_seed.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

async function seedAuth() {
  console.log("Seeding Authentication...");
  for (const user of authUsers) {
    try {
      await admin.auth().createUser({ ...user });
      console.log(`✔ Auth user created: ${user.email}`);
    } catch (err) {
      console.error(`✘ Failed to create auth user ${user.email}:`, err.message);
    }
  }
}

async function seedFirestore() {
  console.log("Seeding Firestore...");
  for (const entry of firestoreSeed) {
    try {
      await db.collection(entry.collection).doc(entry.doc).set(entry.data);
      console.log(`✔ Firestore doc created: ${entry.collection}/${entry.doc}`);
    } catch (err) {
      console.error(`✘ Failed to create Firestore doc ${entry.collection}/${entry.doc}:`, err.message);
    }
  }
}

async function main() {
  await seedAuth();
  await seedFirestore();
  console.log("📦 Seeding complete.");
}

main().catch(console.error);
