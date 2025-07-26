// set-claims.js
const admin = require("firebase-admin");
// IMPORTANT: You must create this file and paste your service account key JSON into it.
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function grantAdmin() {
  // This UID must match the 'id' field in your users.json for the system admin.
  const uid = "system_admin_user"; 
  try {
    await admin.auth().setCustomUserClaims(uid, { systemAdmin: true });
    console.log(`✅ Granted systemAdmin claim to UID: ${uid}`);
  } catch (error) {
    console.error(`✘ Failed to grant claims to UID: ${uid}`, error);
  }
}

grantAdmin().then(() => process.exit(0));
