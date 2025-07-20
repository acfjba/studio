// src/lib/firebase/seed.ts
import { writeBatch, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { staffData, schoolData, sampleLibraryBooksData, sampleExamResultsData, sampleUsersSeedData } from '@/lib/data';

export async function seedDatabase() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Cannot seed database.");
  }

  // A new batch is created for a fresh transaction.
  const batch = writeBatch(db);

  try {
    // Seed Schools
    console.log("Seeding schools...");
    schoolData.forEach(school => {
      const docRef = doc(db, 'schools', school.id);
      batch.set(docRef, school);
    });

    // Seed Staff
    console.log("Seeding staff...");
    staffData.forEach(staffMember => {
      const docRef = doc(db, 'staff', staffMember.id);
      batch.set(docRef, staffMember);
    });
    
    // Seed Users
    console.log("Seeding users...");
    sampleUsersSeedData.forEach(user => {
      // Use the user's UID as the document ID in the 'users' collection
      const docRef = doc(db, 'users', user.uid);
      batch.set(docRef, user);
    });

    // Seed Library Books
    console.log("Seeding library books...");
    sampleLibraryBooksData.forEach(book => {
      const docRef = doc(db, 'books', book.id);
      batch.set(docRef, book);
    });

    // Seed Exam Results
    console.log("Seeding exam results...");
    sampleExamResultsData.forEach(result => {
      const docRef = doc(db, 'examResults', result.id);
      batch.set(docRef, result);
    });
    
    // Commit the entire batch of writes to Firestore at once.
    console.log('Committing batch to Firestore...');
    await batch.commit();
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error("Error during batch creation or commit:", error);
    // Re-throw the error so it can be caught and displayed by the calling component.
    throw error;
  }
}