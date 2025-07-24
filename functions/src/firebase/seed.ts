

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
const SCHOOL_ID_SECONDARY = "na2024";
const SCHOOL_ID_TERTIARY = "su1010";


const schoolsData = [
  { id: SCHOOL_ID_MAIN, name: "Example Primary School", address: "123 Main St." },
  { id: SCHOOL_ID_SECONDARY, name: "Natabua High School", address: "456 School Rd." },
  { id: SCHOOL_ID_TERTIARY, name: "Adi Cakobau School", address: "789 University Ave." },
];

const usersData = [
    { uid: "user_sysadmin_global", email: "systemadmin@example.com", name: "System Administrator", role: "system-admin", password: "adminpassword" },
    { uid: "user_primaryadmin_3046", email: "gandhi.bhawan@yahoo.com",  name: "Primary Admin", role: "primary-admin", schoolId: SCHOOL_ID_MAIN, password: "Lastword123#" },
    { uid: "user_headteacher_3046", email: "headteachergb@gmail.com",  name: "Head Teacher", role: "head-teacher", schoolId: SCHOOL_ID_MAIN, password: "password123" },
    { uid: "user_teacher_3046_1", email: "schoolteachergb@gmail.com",name: "School Teacher", role: "teacher", schoolId: SCHOOL_ID_MAIN, password: "password123" },
    { uid: "user_nilesh_sharma", email: "nileshdsharma1982@yahoo.com", name: "NILESH SHARMA", role: "head-teacher", schoolId: "la3046", password: "83985abc"},
    { uid: "user_senirosi_ledua", email: "leduasenirosi@gmail.com", name: "SENIROSI LEDUA", role: "teacher", schoolId: "la3046", password: "83060abc"},
    { uid: "user_gayleshni_dev", email: "gayleshnigdev@gmail.com", name: "GAYLESHNI GAYETRI DEV", role: "teacher", schoolId: "na2024", password: "password123"},
    { uid: "user_shivam_raj", email: "shivamraj@gmail.com", name: "SHIVAM MELVIN RAJ", role: "teacher", schoolId: "su1010", password: "password123"},
    { uid: "user_seema_sharma", email: "seemasharma@gmail.com", name: "SEEMA SHARMA", role: "teacher", schoolId: "la3046", password: "password123"},
    { uid: "user_grace_wilson", email: "gracewilson@gmail.com", name: "GRACE WILSON", role: "teacher", schoolId: "na2024", password: "password123"},
    { uid: "user_librarian", email: "librarian@example.com", name: "Laura Jones", role: "librarian", schoolId: "la3046", password: "nasty@1121"},
    
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
      // Upsert Auth user
      try {
        let userRecord = await adminAuth.getUserByEmail(u.email).catch(() => null);

        if (userRecord) {
            // User exists, update them
            await adminAuth.updateUser(userRecord.uid, {
                password: u.password,
                displayName: u.name,
            });
            console.log(`Auth user updated: ${u.email}`);
        } else {
            // User does not exist, create them
            userRecord = await adminAuth.createUser({
                uid: u.uid,
                email: u.email,
                password: u.password,
                displayName: u.name,
            });
            console.log(`Auth user created: ${u.email}`);
        }

        // Set Custom Claims
        const claims: { role: string; schoolId?: string | null } = { role: u.role };
        if (u.schoolId) {
            claims.schoolId = u.schoolId;
        }
        await adminAuth.setCustomUserClaims(userRecord.uid, claims);
        console.log(`Successfully set claims for ${u.email}:`, claims);

      } catch (e: any) {
          console.error(`Failed to process Auth user ${u.email}:`, e);
      }
      
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
      
      const userDocPath = 'users';
      await adminDb.collection(userDocPath).doc(u.uid).set(userDocData);
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
        assignedTo: ["user_teacher_3046_1"],
        createdAt: Timestamp.now(),
        createdBy: "user_primaryadmin_3046",
      });

    // 4) Seed Sample Entries
    const entries = [
      { entryId: "ENT1", teacherId: "user_teacher_3046_1", status: "submitted", rating: null, comments: "", offsetDays: 0 },
      { entryId: "ENT2", teacherId: "user_teacher_3046_1", status: "approved",  rating: 8,   comments: "Good work.",    offsetDays: -10 },
      { entryId: "ENT3", teacherId: "user_teacher_3046_1", status: "rejected",  rating: null, comments: "Please revise.",offsetDays: -20 },
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
