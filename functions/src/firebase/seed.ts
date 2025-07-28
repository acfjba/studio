// functions/src/firebase/seed.ts
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
} from './../data';

interface SeedReport {
    users: string[];
    schools: string[];
    staff: string[];
    inventory: string[];
    examResults: string[];
    libraryBooks: string[];
    disciplinaryRecords: string[];
    counsellingRecords: string[];
    ohsRecords: string[];
}

/**
 * Seeds the database with essential data from JSON files.
 * This function is idempotent: it will update existing entries or create
 * them if they don't exist.
 * @returns A report of all actions taken.
 */
export async function seedDatabase(): Promise<SeedReport> {
  console.log("Starting database seed process...");
  
  if (!adminAuth || !adminDb) {
    throw new Error("Firebase Admin SDK not initialized. Cannot seed database.");
  }

  const report: SeedReport = {
    users: [],
    schools: [],
    staff: [],
    inventory: [],
    examResults: [],
    libraryBooks: [],
    disciplinaryRecords: [],
    counsellingRecords: [],
    ohsRecords: []
  };

  // --- Users ---
  // Auth user creation needs to be done one by one, not in a batch.
  if (usersSeedData.length > 0) {
    console.log(`Processing ${usersSeedData.length} user(s)...`);
    for (const u of usersSeedData) {
      try {
        const { id, email, password, displayName, role, schoolId } = u;
        if (!id || !email || !password || !displayName || !role) {
          report.users.push(`Skipping invalid user entry: ${JSON.stringify(u)}`);
          continue;
        }
        
        try {
          await adminAuth.getUser(id);
          report.users.push(`Auth user already exists: ${email}`);
        } catch (error: any) {
          if (error.code === 'auth/user-not-found') {
            await adminAuth.createUser({ uid: id, email, password, displayName });
            report.users.push(`Created Auth user: ${email}`);
          } else {
            throw error; // Re-throw other auth errors
          }
        }
        
        // Write/update user data in Firestore 'users' collection
        await adminDb.collection("users").doc(id).set({ id, email, displayName, role, schoolId: schoolId || null });
        report.users.push(`-> Set/updated Firestore document for ${email}`);
        
      } catch (error: any) {
        report.users.push(`❌ Error processing user ${u.email}: ${error.message}`);
      }
    }
  } else {
    console.log("No users found to seed.");
  }

  // --- Other Collections (batched) ---
  const collectionsToSeed = [
    { name: 'schools', data: schoolData, reportKey: 'schools' as keyof SeedReport },
    { name: 'staff', data: staffData, reportKey: 'staff' as keyof SeedReport },
    { name: 'inventory', data: inventoryData, reportKey: 'inventory' as keyof SeedReport },
    { name: 'examResults', data: sampleExamResultsData, reportKey: 'examResults' as keyof SeedReport },
    { name: 'libraryBooks', data: libraryBooksData, reportKey: 'libraryBooks' as keyof SeedReport },
    { name: 'disciplinaryRecords', data: disciplinaryRecordsData, reportKey: 'disciplinaryRecords' as keyof SeedReport },
    { name: 'counsellingRecords', data: counsellingRecordsData, reportKey: 'counsellingRecords' as keyof SeedReport },
    { name: 'ohsRecords', data: ohsRecordsData, reportKey: 'ohsRecords' as keyof SeedReport }
  ];

  const batch = adminDb.batch();

  for (const collection of collectionsToSeed) {
    if (collection.data.length > 0) {
      collection.data.forEach((item: any) => {
        if(item.id) { // Ensure items have an ID to be seeded
            const docRef = adminDb.collection(collection.name).doc(item.id);
            batch.set(docRef, item);
            (report[collection.reportKey] as string[]).push(`Queued ${item.id} for ${collection.name}`);
        }
      });
      console.log(`Queued ${collection.data.length} documents for ${collection.name}.`);
    } else {
      console.log(`No data for ${collection.name}. Skipping.`);
    }
  }

  try {
    await batch.commit();
    console.log('✅ Firestore batch commit successful!');
  } catch (error: any) {
    console.error('❌ Firestore batch commit failed:', error.message);
  }

  console.log('\nFull database seeding process complete!');
  return report;
}
