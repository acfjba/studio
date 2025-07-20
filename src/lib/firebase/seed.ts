// src/lib/firebase/seed.ts
import { writeBatch, collection, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { staffData as sampleStaffSeedData, schoolData, sampleLibraryBooksData, sampleExamResultsData } from '@/lib/data';

export async function seedDatabase() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Cannot seed database.");
  }

  const batch = writeBatch(db);

  // Seed Schools
  schoolData.forEach(school => {
    const docRef = doc(db, 'schools', school.id);
    batch.set(docRef, school);
  });

  // Seed Staff
  sampleStaffSeedData.forEach(staff => {
    const { id, ...staffDetails } = staff;
    const docRef = doc(db, 'staff', id);
    batch.set(docRef, staffDetails);
  });

  // Seed Library Books
  sampleLibraryBooksData.forEach(book => {
      const { id, ...bookDetails } = book;
      const docRef = doc(db, 'books', id);
      batch.set(docRef, bookDetails);
  });

  // Seed Exam Results
  sampleExamResultsData.forEach(result => {
      const { id, ...resultDetails } = result;
      const docRef = doc(db, 'examResults', id);
      batch.set(docRef, resultDetails);
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
