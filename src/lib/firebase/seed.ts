
'use server';

// src/lib/firebase/seed.ts
import { writeBatch, doc } from 'firebase/firestore';
import { adminDb, adminAuth } from './admin'; // Use Admin SDK for both DB and Auth
import { 
    schoolsSeedData, 
    usersSeedData,
    staffSeedData,
    libraryBooksSeedData,
    examResultsSeedData,
    disciplinaryRecordsSeedData,
    counsellingRecordsSeedData,
    ohsRecordsSeedData
} from '@/lib/seed-data';

export async function seedDatabase() {
  // Use the admin SDK which has privileged access and bypasses security rules.
  // This is the correct approach for a trusted server-side seeding process.
  const batch = writeBatch(adminDb);

  // ---------- Schools ----------
  console.log("Seeding schools...");
  schoolsSeedData.forEach((sch) =>
    batch.set(doc(adminDb, 'schools', sch.id), sch),
  );

  // ---------- Other collections ----------
   console.log("Seeding staff...");
  staffSeedData.forEach((st) =>
    batch.set(doc(adminDb, 'staff', st.id), st),
  );
   console.log("Seeding library books...");
  libraryBooksSeedData.forEach((bk) =>
    batch.set(doc(adminDb, 'books', bk.id), bk),
  );
   console.log("Seeding exam results...");
  examResultsSeedData.forEach((ex) =>
    batch.set(doc(adminDb, 'examResults', ex.id), ex),
  );
   console.log("Seeding disciplinary records...");
  disciplinaryRecordsSeedData.forEach((dr) =>
    batch.set(doc(adminDb, 'disciplinary', dr.id), dr),
  );
   console.log("Seeding counselling records...");
  counsellingRecordsSeedData.forEach((cr) => {
    batch.set(doc(adminDb, 'counselling', cr.id), cr);
  });
   console.log("Seeding OHS records...");
   ohsRecordsSeedData.forEach((or) => {
    batch.set(doc(adminDb, 'ohs', or.id), or);
   });
  
  // ---------- Users + Auth Claims ----------
  console.log("Processing Auth users and Firestore user documents...");
  for (const u of usersSeedData) {
    // Set Firestore user document
    batch.set(doc(adminDb, 'users', u.id), {
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
                password: u.password,
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
