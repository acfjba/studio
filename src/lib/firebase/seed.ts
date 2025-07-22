
'use server';

// src/lib/firebase/seed.ts
import { writeBatch, doc } from 'firebase/firestore';
import { 
    staffSeedData, 
    schoolsSeedData, 
    usersSeedData,
    libraryBooksSeedData,
    examResultsSeedData,
    disciplinaryRecordsSeedData,
    counsellingRecordsSeedData,
    ohsRecordsSeedData
} from '@/lib/seed-data';
import { adminDb, adminAuth } from './admin';

export async function seedDatabase() {
  const batch = writeBatch(adminDb);

  // ---------- Schools ----------
  console.log("Seeding schools...");
  schoolsSeedData.forEach((sch) => {
    batch.set(doc(adminDb, 'schools', sch.id), sch);
  });

  // ---------- Staff ----------
  console.log("Seeding staff...");
  staffSeedData.forEach((st) => {
    const { id, ...rest } = st;
    const data = { ...rest, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    batch.set(doc(adminDb, 'staff', id), data);
  });
  
  // ---------- Library Books ----------
  console.log("Seeding library books...");
  libraryBooksSeedData.forEach((bk) => {
    const { id, ...rest } = bk;
    const data = { ...rest, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    batch.set(doc(adminDb, 'books', id), data);
  });

  // ---------- Exam Results ----------
  console.log("Seeding exam results...");
  examResultsSeedData.forEach((ex) => {
    const { id, ...rest } = ex;
    const data = { ...rest, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    batch.set(doc(adminDb, 'examResults', id), data);
  });

  // ---------- Disciplinary Records ----------
  console.log("Seeding disciplinary records...");
  disciplinaryRecordsSeedData.forEach((dr) => {
    const { id, ...rest } = dr;
    const data = { ...rest, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    batch.set(doc(adminDb, 'disciplinary', id), data);
  });

  // ---------- Counselling Records ----------
  console.log("Seeding counselling records...");
  counsellingRecordsSeedData.forEach((cr) => {
    const { id, ...rest } = cr;
    const data = { ...rest, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    batch.set(doc(adminDb, 'counselling', cr.id), data);
  });

  // ---------- OHS Records ----------
  console.log("Seeding OHS records...");
  ohsRecordsSeedData.forEach((or) => {
    const { id, ...rest } = or;
    const data = { ...rest, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    batch.set(doc(adminDb, 'ohs', id), data);
  });
  
  // ---------- Users + Auth Claims ----------
  console.log("Processing Auth users and Firestore user documents...");
  for (const u of usersSeedData) {
    batch.set(doc(adminDb, 'users', u.id), {
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      schoolId: u.schoolId ?? null,
    });

    try {
        let userRecord = await adminAuth.getUser(u.id).catch(() => null);
        if (!userRecord) {
            userRecord = await adminAuth.createUser({ 
                uid: u.id, 
                email: u.email, 
                displayName: u.displayName,
                password: u.password,
            });
            console.log(`Created Auth user: ${u.email}`);
        }
        await adminAuth.setCustomUserClaims(userRecord.uid, { role: u.role, schoolId: u.schoolId ?? null });
    } catch (error) {
        console.error(`Error processing Auth user ${u.email}:`, error);
    }
  }

  console.log("Committing all data to Firestore...");
  await batch.commit();
  console.log('Firestore data seeding complete!');
}
