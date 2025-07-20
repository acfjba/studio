// src/lib/firebase/seed.ts
import { writeBatch, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { staffData as sampleStaffSeedData, schoolData, sampleLibraryBooksData, sampleExamResultsData } from '@/lib/data';

export async function seedDatabase() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Cannot seed database.");
  }

  const batch = writeBatch(db);

  // Seed Schools
  console.log("Seeding schools...");
  schoolData.forEach(school => {
    const docRef = doc(db, 'schools', school.id);
    batch.set(docRef, school);
  });

  // Seed Staff
  console.log("Seeding staff...");
  sampleStaffSeedData.forEach(staff => {
    // The 'id' from the seed data will be used as the document ID in Firestore.
    const { id, ...staffDetails } = staff;
    if (id) {
      const docRef = doc(db, 'staff', id);
      batch.set(docRef, staffDetails);
    }
  });

  // Seed Library Books
  console.log("Seeding library books...");
  sampleLibraryBooksData.forEach(book => {
    const { id, ...bookDetails } = book;
    if (id) {
        const docRef = doc(db, 'books', id);
        batch.set(docRef, bookDetails);
    }
  });

  // Seed Exam Results
  console.log("Seeding exam results...");
  sampleExamResultsData.forEach(result => {
      const { id, ...resultDetails } = result;
      if (id) {
        const docRef = doc(db, 'examResults', id);
        batch.set(docRef, resultDetails);
      }
  });
  
  // You can add more collections to seed here, for example:
  // - Counselling records
  // - Disciplinary records
  // - OHS records
  // etc.

  // Commit the batch
  await batch.commit();
  console.log('Database seeded successfully!');
}
