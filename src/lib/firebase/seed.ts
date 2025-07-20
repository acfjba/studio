// src/lib/firebase/seed.ts
import { writeBatch, collection, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { staffData as sampleStaffSeedData, schoolData, sampleLibraryBooksData } from '@/lib/data';

export async function seedDatabase() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Cannot seed database.");
  }

  const batch = writeBatch(db);

  // Seed Schools
  const schoolsCollection = collection(db, 'schools');
  schoolData.forEach(school => {
    const docRef = doc(schoolsCollection, school.id);
    batch.set(docRef, school);
  });

  // Seed Staff
  const staffCollection = collection(db, 'staff');
  sampleStaffSeedData.forEach(staff => {
    const { id, ...staffDetails } = staff;
    const docRef = doc(staffCollection, id);
    batch.set(docRef, staffDetails);
  });

  // Seed Library Books
  const booksCollection = collection(db, 'books');
  sampleLibraryBooksData.forEach(book => {
      const { id, ...bookDetails } = book;
      const docRef = doc(booksCollection, id);
      batch.set(docRef, bookDetails);
  });
  
  // You can add more collections to seed here, for example:
  // - Counselling records
  // - Disciplinary records
  // - OHS records
  // - Exam Results
  // etc.

  // Commit the batch
  await batch.commit();
  console.log('Database seeded successfully!');
}
