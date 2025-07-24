

/**
 * @fileOverview Firestore Seeding Script
 *
 * This script provides sample data and functions to populate your Firestore database
 * with initial collections and documents for the Digital Platform for Schools.
 *
 */

import { getFirestore, type Firestore, type DocumentData, Timestamp } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { adminDb, adminAuth } from './admin';

// --- Configuration ---
const SCHOOL_ID_MAIN = "la3046"; 

const schoolsData = [
  { id: SCHOOL_ID_MAIN, name: "Example Primary School", address: "123 Main St." },
];

const usersData = [
    { uid: "sys01",     email: "acjfk@hotmail.com",        name: "System Administrator", role: "system-admin" },
    { uid: "prim01",    email: "gandhi.bhawan@yahoo.com",  name: "Primary Admin",        role: "primary-admin", schoolId: SCHOOL_ID_MAIN },
    { uid: "head01",    email: "headteachergb@gmail.com",  name: "Head Teacher",         role: "head-teacher", schoolId: SCHOOL_ID_MAIN },
    { uid: "teacher01", email: "schoolteachergb@gmail.com",name: "School Teacher",       role: "teacher", schoolId: SCHOOL_ID_MAIN },
];


async function seedCollection(
  db: Firestore,
  collectionPath: string,
  data: Array<DocumentData & { id?: string }>,
  batchSize: number = 100
): Promise<void> {
  console.log(`Seeding collection: ${collectionPath}...`);
  const collectionRef = db.collection(collectionPath);
  let batch = db.batch();
  let count = 0;
  const totalItems = data.length;

  if (totalItems === 0) {
    console.log(`No data to seed for ${collectionPath}. Skipping.`);
    return;
  }

  for (let i = 0; i < totalItems; i++) {
    const item = data[i];
    const docId = item.id;
    const { id, ...itemData } = item;
    
    const docRef = collectionRef.doc(docId);
    batch.set(docRef, {
      ...itemData,
      createdAt: itemData.createdAt || Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    count++;

    if (count % batchSize === 0 || i === totalItems - 1) {
      try {
        await batch.commit();
        console.log(`Committed batch of ${count % batchSize === 0 ? batchSize : count % batchSize} documents to ${collectionPath}. (${i + 1}/${totalItems})`);
      } catch (e) {
        console.error(`Error committing batch to ${collectionPath}:`, e);
      }
      if (i < totalItems - 1) {
        batch = db.batch();
      }
    }
  }
  console.log(`Finished seeding ${collectionPath}. Total documents processed: ${totalItems}`);
}


export async function seedDatabase() {
    console.log("Starting Firestore data seeding process...");
    
    // 1) Seed Schools
    await seedCollection(adminDb, 'schools', schoolsData);
    
    // 2) Seed Users and Auth
    for (const u of usersData) {
      // Create Auth user if not exists
      try {
        await adminAuth.createUser({
          uid: u.uid,
          email: u.email,
          password: "La@123tka",
          displayName: u.name,
        });
        console.log(`Auth user created: ${u.uid}`);
      } catch (e: any) {
        if (["auth/uid-already-exists", "auth/email-already-exists"].includes(e.code)) {
          console.log(`Auth user exists, skipping: ${u.uid}`);
        } else {
          throw e;
        }
      }

      // Set Custom Claims
      const claims: { role: string; schoolId?: string | null } = { role: u.role };
      if (u.schoolId) {
        claims.schoolId = u.schoolId;
      }
      await adminAuth.setCustomUserClaims(u.uid, claims);
      console.log(`Successfully set claims for ${u.email}:`, claims);

      // Firestore profile
      const userDocData = {
          name: u.name,
          email: u.email,
          role: u.role,
          tpfNumber: `TPF-${u.uid}`,
          status: "active",
          createdAt: Timestamp.now(),
          schoolId: u.schoolId || null,
      };
      
      const userDocPath = u.schoolId ? `schools/${u.schoolId}/users` : 'users';
      await adminDb.collection(userDocPath).doc(u.uid).set(userDocData);
      
      // Also create a top-level user for easy lookup
       await adminDb.collection('users').doc(u.uid).set(userDocData);
    }
    
    // 3) Seed Workbook Plan
    const planId = "PLAN_WEEKLY_001";
    await adminDb
      .collection("schools").doc(SCHOOL_ID_MAIN)
      .collection("workbookPlans").doc(planId)
      .set({
        title: "Weekly Reflection",
        description: "Submit your weekly reflections.",
        frequency: "weekly",
        startDate: Timestamp.fromDate(new Date("2025-01-01")),
        endDate: Timestamp.fromDate(new Date("2025-12-31")),
        assignedTo: ["teacher01"],
        createdAt: Timestamp.now(),
        createdBy: "prim01",
      });

    // 4) Seed Sample Entries
    const entries = [
      { entryId: "ENT1", teacherId: "teacher01", status: "submitted", rating: null, comments: "", offsetDays: 0 },
      { entryId: "ENT2", teacherId: "teacher01", status: "approved",  rating: 8,   comments: "Good work.",    offsetDays: -10 },
      { entryId: "ENT3", teacherId: "teacher01", status: "rejected",  rating: null, comments: "Please revise.",offsetDays: -20 },
    ];
    for (const e of entries) {
      const when = new Date();
      when.setDate(when.getDate() + e.offsetDays);

      await adminDb
        .collection("schools").doc(SCHOOL_ID_MAIN)
        .collection("workbookEntries").doc(e.entryId)
        .set({
          planId,
          teacherId: e.teacherId,
          submittedAt: Timestamp.fromDate(when),
          status: e.status,
          rating: e.rating,
          reviewComments: e.comments,
          reviewedAt: e.status !== "submitted" ? Timestamp.fromDate(when) : null,
        });
    }

    // 5) Seed System Logs
    const logBatch = adminDb.batch();
    usersData.forEach(u => {
        const logRef = adminDb.collection("systemLogs").doc();
        logBatch.set(logRef, {
            timestamp: Timestamp.now(),
            userId: u.uid,
            action: "seedUser",
            details: { schoolId: u.schoolId || null, role: u.role },
        });
    });
    entries.forEach(e => {
        const logRef = adminDb.collection("systemLogs").doc();
        logBatch.set(logRef, {
            timestamp: Timestamp.now(),
            userId: e.teacherId,
            action: `seedEntry_${e.status}`,
            details: { entryId: e.entryId, status: e.status },
        });
    });
    await logBatch.commit();


    console.log("Firestore data seeding completed successfully!");
}
