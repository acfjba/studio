
// firestore-loader.js
const admin = require("firebase-admin");
const fs = require("fs");

// Initialize Admin SDK using Application Default Credentials
// This will automatically use the service account key from the
// GOOGLE_APPLICATION_CREDENTIALS environment variable.
admin.initializeApp();

const db = admin.firestore();

async function loadData() {
  console.log("🔄 Loading Firestore data...");

  const collections = ["users", "schools", "staff", "inventory", "examResults", "libraryBooks", "disciplinaryRecords", "counsellingRecords", "ohsRecords"];
  const data = {};

  for (const col of collections) {
    try {
        const snapshot = await db.collection(col).get();
        data[col] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`- Fetched ${snapshot.docs.length} documents from '${col}'`);
    } catch (error) {
        console.error(`❌ Error fetching collection '${col}':`, error.message);
        data[col] = []; // Add an empty array for the failed collection
    }
  }

  // Save to local JSON file
  fs.writeFileSync("firestore-export.json", JSON.stringify(data, null, 2));
  console.log("\n✅ Data exported to firestore-export.json");
}

loadData().catch((err) => {
  console.error("❌ Error loading data:", err);
  process.exit(1);
}).then(() => {
    process.exit(0);
});
