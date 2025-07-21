
// src/lib/firebase/seed.ts
import { writeBatch, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { staffData, schoolData, sampleExamResultsData } from '@/lib/data';
import { sampleUsersSeedData, sampleLibraryBooksData } from '@/lib/seed-data';

export async function seedDatabase() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Cannot seed database.");
  }

  const batch = writeBatch(db);

  try {
    console.log("Seeding schools...");
    schoolData.forEach(school => {
      const docRef = doc(db, 'schools', school.id);
      batch.set(docRef, school);
    });

    console.log("Seeding staff...");
    staffData.forEach(staffMember => {
      const docRef = doc(db, 'staff', staffMember.id);
      batch.set(docRef, staffMember);
    });
    
    console.log("Seeding users...");
    sampleUsersSeedData.forEach(user => {
      const docRef = doc(db, 'users', user.uid);
      batch.set(docRef, user);
    });

    console.log("Seeding library books...");
    sampleLibraryBooksData.forEach(book => {
      const docRef = doc(db, 'books', book.id);
      batch.set(docRef, book);
    });

    console.log("Seeding exam results...");
    sampleExamResultsData.forEach(result => {
      const docRef = doc(db, 'examResults', result.id);
      batch.set(docRef, result);
    });
    
    console.log('Committing batch to Firestore...');
    await batch.commit();
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error("Error during batch creation or commit:", error);
    throw error;
  }
}
