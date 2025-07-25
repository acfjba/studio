
// functions/src/firebase/seed.ts
import { doc } from 'firebase/firestore';
import { adminDb, adminAuth } from './admin';
import { 
  usersSeedData, 
  schoolData, 
  staffData, 
  inventoryData,
  sampleExamResultsData,
  libraryBooksData,
  disciplinaryRecordsData,
  counsellingRecordsData,
  ohsRecordsData
} from '../data';

/**
 * Seeds the database with essential user data from users.json.
 * This function is idempotent: it will update existing users or create
 * them if they don't exist, ensuring Auth and Firestore are in sync.
 */
export async function seedDatabase() {
  console.log("Starting database seed process...");

  // --- Users + Auth Claims ---
  if (!usersSeedData || usersSeedData.length === 0) {
    console.log("No users found in src/data/users.json. Skipping user seeding.");
  } else {
    console.log(`Processing ${usersSeedData.length} user(s)...`);
    for (const u of usersSeedData) {
      try {
        const { id, email, password, displayName, role, schoolId } = u;

        if (!id || !email || !password || !displayName || !role) {
          console.error(`Skipping invalid user entry: ${JSON.stringify(u)}`);
          continue;
        }
        
        // 1. Create or Update user in Firebase Authentication
        let userRecord;
        try {
          userRecord = await adminAuth.getUser(id);
          await adminAuth.updateUser(userRecord.uid, {
            email: email,
            password: password,
            displayName: displayName,
          });
          console.log(`✅ Updated Auth user: ${email} (UID: ${userRecord.uid})`);
        } catch (error: any) {
          if (error.code === 'auth/user-not-found') {
            userRecord = await adminAuth.createUser({ 
              uid: id,
              email: email, 
              password: password,
              displayName: displayName,
            });
            console.log(`✅ Created Auth user: ${email} (UID: ${userRecord.uid})`);
          } else {
            throw error;
          }
        }

        // 2. Set Custom Claims for Role-Based Access Control
        const claims = { role, schoolId: schoolId ?? null };
        await adminAuth.setCustomUserClaims(userRecord.uid, claims);
        console.log(`   - Set custom claims for ${email}:`, claims);
        
        // 3. Set the user document in the top-level 'users' collection
        const userDocRef = doc(adminDb, 'users', id);
        const userDocPayload = {
          email: email,
          displayName: displayName,
          role: role,
          schoolId: schoolId ?? null,
        };
        
        await adminDb.collection("users").doc(id).set(userDocPayload);
        console.log(`   - Set Firestore document in /users/${id}`);

      } catch (error) {
        console.error(`❌ Error processing user ${u.email}:`, error);
      }
    }
    console.log('\nUser seeding process complete!');
  }

  // --- Other Collections ---
  const collectionsToSeed = [
    { name: 'schools', data: schoolData },
    { name: 'staff', data: staffData },
    { name: 'inventory', data: inventoryData },
    { name: 'examResults', data: sampleExamResultsData },
    { name: 'libraryBooks', data: libraryBooksData },
    { name: 'disciplinaryRecords', data: disciplinaryRecordsData },
    { name: 'counsellingRecords', data: counsellingRecordsData },
    { name: 'ohsRecords', data: ohsRecordsData }
  ];

  for (const collection of collectionsToSeed) {
    if (collection.data.length > 0) {
      console.log(`Seeding ${collection.name}...`);
      const batch = adminDb.batch();
      collection.data.forEach((item: any) => {
        const docRef = doc(adminDb, collection.name, item.id);
        batch.set(docRef, item);
      });
      await batch.commit();
      console.log(`✅ Seeded ${collection.data.length} documents into ${collection.name}.`);
    } else {
      console.log(`No data for ${collection.name}. Skipping.`);
    }
  }

  console.log('\nFull database seeding process complete!');
}
