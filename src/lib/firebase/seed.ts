
// src/lib/firebase/seed.ts
import { writeBatch, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
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
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Cannot seed database.");
  }

  const batch = writeBatch(db);

  try {
    console.log("Seeding schools...");
    schoolsSeedData.forEach(school => {
      const docRef = doc(db, 'schools', school.id);
      batch.set(docRef, school);
    });

    console.log("Seeding users...");
    usersSeedData.forEach(user => {
      const { id, ...userData } = user;
      const docRef = doc(db, 'users', id);
      batch.set(docRef, userData);
    });
    
    console.log("Seeding staff...");
    staffSeedData.forEach(staffMember => {
      const { id, ...staffData } = staffMember;
      const docRef = doc(db, 'staff', id);
      batch.set(docRef, staffData);
    });

    console.log("Seeding library books...");
    libraryBooksSeedData.forEach(book => {
      const { id, ...bookData } = book;
      const docRef = doc(db, 'books', id);
      batch.set(docRef, bookData);
    });

    console.log("Seeding exam results...");
    examResultsSeedData.forEach(result => {
      const { id, ...resultData } = result;
      const docRef = doc(db, 'examResults', id);
      batch.set(docRef, resultData);
    });

    console.log("Seeding disciplinary records...");
    disciplinaryRecordsSeedData.forEach(record => {
      const { id, ...recordData } = record;
      const docRef = doc(db, 'disciplinary', id);
      batch.set(docRef, recordData);
    });

    console.log("Seeding counselling records...");
    counsellingRecordsSeedData.forEach(record => {
      const { id, ...recordData } = record;
      const docRef = doc(db, 'counselling', id);
      batch.set(docRef, recordData);
    });

    console.log("Seeding OHS records...");
    ohsRecordsSeedData.forEach(record => {
        const { id, ...recordData } = record;
        const docRef = doc(db, 'ohs', id);
        batch.set(docRef, recordData);
    });
    
    console.log('Committing batch to Firestore...');
    await batch.commit();
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error("Error during batch creation or commit:", error);
    throw error;
  }
}
