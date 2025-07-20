// src/lib/firebase/seed.ts
import { writeBatch, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { staffData, schoolData, sampleLibraryBooksData, sampleExamResultsData } from '@/lib/data';

export async function seedDatabase() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Cannot seed database.");
  }

  const batch = writeBatch(db);

  try {
    // Seed Schools
    console.log("Seeding schools...");
    for (const school of schoolData) {
      if (school.id) {
        const docRef = doc(db, 'schools', school.id);
        batch.set(docRef, school);
      }
    }

    // Seed Staff
    console.log("Seeding staff...");
    for (const staff of staffData) {
      // The 'id' from the seed data will be used as the document ID in Firestore.
      if (staff.id) {
        const { id, ...staffDetails } = staff;
        const docRef = doc(db, 'staff', id);
        batch.set(docRef, staffDetails);
      }
    }

    // Seed Library Books
    console.log("Seeding library books...");
    for (const book of sampleLibraryBooksData) {
      if (book.id) {
          const { id, ...bookDetails } = book;
          const docRef = doc(db, 'books', id);
          batch.set(docRef, bookDetails);
      }
    }

    // Seed Exam Results
    console.log("Seeding exam results...");
    for (const result of sampleExamResultsData) {
        if (result.id) {
          const { id, ...resultDetails } = result;
          const docRef = doc(db, 'examResults', id);
          batch.set(docRef, resultDetails);
        }
    }
    
    // You can add more collections to seed here in the same pattern.

    // Commit the batch
    console.log('Committing batch...');
    await batch.commit();
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error("Error during batch creation or commit:", error);
    // Re-throw the error to be caught by the calling function in the component
    throw error;
  }
}
