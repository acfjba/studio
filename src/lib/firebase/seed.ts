// src/lib/firebase/seed.ts
import { writeBatch, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { adminAuth } from './admin';
import { 
    schoolsSeedData, 
    usersSeedData,
    staffSeedData,
    libraryBooksSeedData,
    examResultsSeedData,
    disciplinaryRecordsSeedData
} from '@/lib/seed-data';

export async function seedDatabase() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Cannot seed database.");
  }

  const batch = writeBatch(db);

  console.log("Seeding schools...");
  schoolsSeedData.forEach(school => {
    const docRef = doc(db, 'schools', school.id);
    batch.set(docRef, school);
  });

  console.log("Seeding staff...");
  staffSeedData.forEach(staff => {
      const docRef = doc(db, 'staff', staff.id);
      batch.set(docRef, staff);
  });

  console.log("Seeding library books...");
  libraryBooksSeedData.forEach(book => {
      const docRef = doc(db, 'libraryBooks', book.id);
      batch.set(docRef, book);
  });

  console.log("Seeding exam results...");
  examResultsSeedData.forEach(result => {
      const docRef = doc(db, 'examResults', result.id);
      batch.set(docRef, result);
  });

  console.log("Seeding disciplinary records...");
  disciplinaryRecordsSeedData.forEach(record => {
      const docRef = doc(db, 'disciplinaryRecords', record.id);
      batch.set(docRef, record);
  });

  console.log("Committing data batch to Firestore...");
  await batch.commit();
  console.log('Firestore data seeded successfully!');

  console.log("Processing Firebase Auth users...");
  for (const u of usersSeedData) {
      try {
          // Add user data to the 'users' collection in Firestore
          await db.collection('users').doc(u.id).set({
              email: u.email,
              displayName: u.displayName,
              role: u.role,
              schoolId: u.schoolId ?? null,
          });

          // Check if user exists in Auth, create if not
          const userRecord = await adminAuth.getUser(u.id).catch(() => null);
          if (!userRecord) {
              await adminAuth.createUser({ 
                  uid: u.id, 
                  email: u.email, 
                  displayName: u.displayName,
                  // For demo purposes, we are using a simple password.
                  // In a real app, you'd generate a secure password or send an invitation link.
                  password: 'password123',
              });
              console.log(`Created Auth user: ${u.email}`);
          }

          // Set custom claims for role-based access control
          await adminAuth.setCustomUserClaims(u.id, { 
              role: u.role, 
              schoolId: u.schoolId ?? null 
          });
          console.log(`Set custom claims for: ${u.email}`);

      } catch (error) {
          console.error(`Error processing user ${u.email}:`, error);
          // Continue with the next user even if one fails
      }
  }
  console.log('Firebase Auth users processed successfully!');
}
