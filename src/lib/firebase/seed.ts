// src/lib/firebase/seed.ts
import { writeBatch, doc } from 'firebase/firestore';
import { adminDb, adminAuth } from './admin';
import fs from 'fs';
import path from 'path';

// Helper function to read a JSON file from the data folder
function readSeedData<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), 'src', 'data', filename);
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as T[];
  } catch (error) {
    console.error(`Error reading or parsing ${filename}:`, error);
    throw new Error(`Could not load data from ${filename}.`);
  }
}

export async function seedDatabase() {
  const batch = writeBatch(adminDb);

  // --- Read data from local JSON files ---
  const schoolsSeedData = readSeedData<{ id: string; name: string; address: string }>('schools.json');
  const staffSeedData = readSeedData<any>('staff.json');
  const usersSeedData = readSeedData<any>('users.json');
  const libraryBooksSeedData = readSeedData<any>('library-books.json');
  const examResultsSeedData = readSeedData<any>('exam-results.json');
  const disciplinaryRecordsSeedData = readSeedData<any>('disciplinary-records.json');
  const counsellingRecordsSeedData = readSeedData<any>('counselling-records.json');
  const ohsRecordsSeedData = readSeedData<any>('ohs-records.json');


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
