
// src/lib/firebase/seed.ts
import { writeBatch, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { adminAuth } from './admin';
import { 
    schoolsSeedData, 
    usersSeedData,
    staffSeedData,
    libraryBooksSeedData,
    examResultsSeedData,
    disciplinaryRecordsSeedData
} from '@/lib/seed-data';

export async function seedDatabase() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Cannot seed database.");
  }

  const batch = writeBatch(db);

  // ---------- Schools ----------
  console.log("Seeding schools...");
  schoolsSeedData.forEach((sch) =>
    batch.set(doc(db, 'schools', sch.id), sch),
  );

  // ---------- Other collections ----------
   console.log("Seeding staff...");
  staffSeedData.forEach((st) =>
    batch.set(doc(db, 'staff', st.id), st),
  );
   console.log("Seeding library books...");
  libraryBooksSeedData.forEach((bk) =>
    batch.set(doc(db, 'libraryBooks', bk.id), bk),
  );
   console.log("Seeding exam results...");
  examResultsSeedData.forEach((ex) =>
    batch.set(doc(db, 'examResults', ex.id), ex),
  );
   console.log("Seeding disciplinary records...");
  disciplinaryRecordsSeedData.forEach((dr) =>
    batch.set(doc(db, 'disciplinaryRecords', dr.id), dr),
  );
  
  // ---------- Users + Auth Claims ----------
  console.log("Processing Auth users and Firestore user documents...");
  for (const u of usersSeedData) {
    // Set Firestore user document
    batch.set(doc(db, 'users', u.id), {
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      schoolId: u.schoolId ?? null,
    });

    // Handle Auth user creation and custom claims
    try {
        const userRecord = await adminAuth.getUser(u.id).catch(() => null);
        if (!userRecord) {
            await adminAuth.createUser({ 
                uid: u.id, 
                email: u.email, 
                displayName: u.displayName,
                // In a real app, you would not hardcode passwords.
                // This is for demonstration purposes only.
                password: 'password123',
            });
            console.log(`Created Auth user: ${u.email}`);
        }
        // Set custom claims for role-based access control
        await adminAuth.setCustomUserClaims(u.id, { role: u.role, schoolId: u.schoolId ?? null });
        console.log(`Set custom claims for: ${u.email}`);
    } catch (error) {
        console.error(`Error processing Auth user ${u.email}:`, error);
        // It's often better to continue seeding other data even if one user fails.
    }
  }


  console.log("Committing all data to Firestore...");
  await batch.commit();
  console.log('Firestore data seeding complete!');
}
