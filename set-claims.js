
// set-claims.js
const admin = require("firebase-admin");

// Initialize Admin SDK using Application Default Credentials
// This will automatically use the service account key from the
// GOOGLE_APPLICATION_CREDENTIALS environment variable.
admin.initializeApp();


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
