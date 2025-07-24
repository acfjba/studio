
/**
 * @fileOverview Firestore Seeding Script
 *
 * This script provides sample data and functions to populate your Firestore database
 * with initial collections and documents for the Digital Platform for Schools.
 *
 */

import { getFirestore, type Firestore, type DocumentData } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { adminDb, adminAuth } from './admin';

// --- Configuration ---
const SCHOOL_ID_MAIN = "3046"; // Primary school ID for the provided user list

const schoolsData = [
  { id: SCHOOL_ID_MAIN, name: "School of Excellence (ID 3046)", address: "1 Education Way, Suva", type: "Primary & Secondary" },
  { id: "SCH-002", name: "Natabua High School", address: "Lautoka, Fiji", type: "Secondary" },
  { id: "SCH-003", name: "Adi Cakobau School", address: "Sawani, Fiji", type: "Secondary" },
];

// Users for SCHOOL_ID_MAIN (3046) based on the provided image
const usersData = [
  { uid: "user_nilesh_sharma_3046", email: "nileshdsharma1982@yahoo.com", displayName: "NILESH SHARMA", role: "head-teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "83985abc" },
  { uid: "user_senirosi_ledua_3046", email: "leduasenirosi@gmail.com", displayName: "SENIROSI LEDUA", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "83060abc" },
  { uid: "user_gayleshni_dev_3046", email: "gayleshnikumar@gmail.com", displayName: "GAYLESHNI GAYETRI DEV", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "80162abc" },
  { uid: "user_seema_sharma_3046", email: "similal03@gmail.com", displayName: "SEEMA SHARMA", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "84586abc" },
  { uid: "user_susana_nauwaqa_3046", email: "su.diwelei@gmail.com", displayName: "SUSANA NAUWAQA", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "85866abc" },
  { uid: "user_komal_chand_3046", email: "acoms1984@gmail.com", displayName: "KOMAL CHAND", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "113547abc" },
  { uid: "user_marama_leba_3046", email: "naivalulevumarama@gmail.com", displayName: "MARAMA LEBA", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "115197abc" },
  { uid: "user_sarina_pillay_3046", email: "sarinapillay@yahoo.com.au", displayName: "SARINA PILLAY", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "66972abc" },
  { uid: "user_shivam_raj_3046", email: "shivammelvin600@gmail.com", displayName: "SHIVAM MELVIN RAJ", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "111724abc" },
  { uid: "user_grace_wilson_3046", email: "gracewilson09@gmail.com", displayName: "GRACE WILSON", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "115472abc" },
  { uid: "user_litia_rokoerenasau_3046", email: "litiayacakuru@gmail.com", displayName: "Litia Rokoerenasau", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "112944abc" },
  { uid: "user_shaleen_singh_3046", email: "24shaleensingh@gmail.com", displayName: "SHALEEN SINGH", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "67588abc" },
  { uid: "user_janardan_naidu_3046", email: "jitennaidu70@gmail.com", displayName: "JANARDAN NAIDU", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "54525abc" },
  { uid: "user_priya_naidu_3046", email: "priyanaidu799@gmail.com", displayName: "PRIYA VANDANA NAIDU", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "65924abc" },
  { uid: "user_ashish_chand_3046", email: "ashishchand920@gmail.com", displayName: "ASHISH CHAND", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "113391abc" },
  { uid: "user_vimlash_raj_3046", email: "vimlashr@yahoo.com", displayName: "VIMLASH RAJ", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "69454abc" },
  { uid: "user_shavya_devi_3046", email: "shavyad97@gmail.com", displayName: "SHAVYA DEVI", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "111801abc" },
  { uid: "user_anit_kumar_3046", email: "akdkumar27@gmail.com", displayName: "ANIT KUMAR", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "112483abc" },
  { uid: "user_adi_bolatolu_3046", email: "snavuda@outlook.com", displayName: "ADI SALOTE BOLATOLU", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "82549abc" },
  { uid: "user_angeline_ram_3046", email: "angeline.ram420@gmail.com", displayName: "ANGELINE VANDANA RAM", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "82986abc" },
  { uid: "user_timoci_ketewai_3046", email: "timket2019@gmail.com", displayName: "TIMOCI KETEWAI", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "44481abc" },
  { uid: "user_viliame_taleca_3046", email: "talecavili@gmail.com", displayName: "Viliame Taleca", role: "teacher", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "56568abc" },
  { uid: "user_primary_admin_3046", email: "gandhi.bhawan@yahoo.com", displayName: "Primary Admin (School 3046)", role: "primary-admin", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "Lastword123#" },
  { uid: "user_librarian_3046", email: "librarian@example.com", displayName: "Librarian (School 3046)", role: "librarian", schoolId: SCHOOL_ID_MAIN, password_for_frontend_sim: "nasty@1121" },
  { uid: "user_sysadmin_global", email: "systemadmin@example.com", displayName: "System Admin Global", role: "system-admin", schoolId: null, password_for_frontend_sim: "adminpassword" },
];

const staffData = usersData.map((user, index) => {
  let position: string;
  let department: string;

  switch (user.role) {
    case "head-teacher":
      position = "Head Teacher";
      department = "Senior Leadership"
      break;
    case "assistant-head-teacher":
        position = "Assistant Head Teacher";
        department = "Senior Leadership"
        break;
    case "teacher":
      position = "Teacher";
      department = "Academics";
      break;
    case "primary-admin":
      position = "Primary Administrator";
      department = "Administration";
      break;
    case "librarian":
      position = "Librarian";
      department = "Academics"
      break;
    case "system-admin":
      position = "System Administrator";
      department = "IT";
      break;
    default:
      position = "Staff";
      department = "General";
  }

  const staffId = `T${String(1001 + index)}`;

  return {
    id: `staff_${user.uid}`,
    staffId: staffId,
    name: user.displayName,
    role: user.role,
    position: position,
    department: department,
    status: "Active",
    email: user.email,
    phone: `+679 555-${String(1000 + index).padStart(4, '0')}`,
    schoolId: user.schoolId,
    userId: user.uid,
  };
});

const examResultsData = [
  { id: "exam_res_main_1", studentId: "S3046_001", studentName: "Student Alpha (3046)", examType: "Trial Test", subject: "General Science", score: "75", grade: 'A', examDate: "2024-07-10", term: "2", year: "2024", recordedByUserId: usersData.find(u=>u.role==='teacher' && u.schoolId === SCHOOL_ID_MAIN)?.uid || "unknown_teacher_uid", schoolId: SCHOOL_ID_MAIN },
  { id: "exam_res_main_2", studentId: "S3046_002", studentName: "Student Beta (3046)", examType: "LANA", subject: "Numeracy", score: "88", grade: 'A+', examDate: "2024-03-15", term: "1", year: "2024", recordedByUserId: usersData.find(u=>u.role==='teacher' && u.schoolId === SCHOOL_ID_MAIN)?.uid || "unknown_teacher_uid", schoolId: SCHOOL_ID_MAIN },
];

const disciplinaryRecordsData = [
  { id: "disc_rec_main_1", studentName: "Student Gamma (3046)", studentId: "S3046_S001", studentDob: "2007-01-15", studentYear: "11", incidentDate: "2024-07-05", issues: ["Drug", "Other"], drugType: "Vape", otherIssue: "Disrupting class.", comments: "Used vape in school premises.", raisedBy: "NILESH SHARMA", parentsInformed: "Yes", actionComments: "Confiscated vape, detention.", userId: usersData.find(u=>u.role==='head-teacher' && u.schoolId === SCHOOL_ID_MAIN)?.uid || "unknown_headteacher_uid", schoolId: SCHOOL_ID_MAIN },
];

const libraryBooksData = [
  { id: "book_main_1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", availableCopies: 3, totalCopies: 3, schoolId: SCHOOL_ID_MAIN, isbn: "9780743273565" },
  { id: "book_main_2", title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", availableCopies: 5, totalCopies: 5, schoolId: SCHOOL_ID_MAIN, isbn: "9780061120084" },
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
    const now = new Date().toISOString();
    batch.set(docRef, {
      ...itemData,
      createdAt: itemData.createdAt || now,
      updatedAt: now,
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

async function setCustomUserClaimsForUsers(auth: Auth, users: typeof usersData): Promise<void> {
  console.log("Setting custom claims for users...");
  for (const user of users) {
    try {
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(user.email);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          console.warn(`User ${user.email} not found in Auth. Creating user...`);
          userRecord = await auth.createUser({
            uid: user.uid, // Use the predefined UID
            email: user.email,
            displayName: user.displayName,
            password: user.password_for_frontend_sim,
            emailVerified: true,
          });
          console.log(`Created user ${user.email} with UID ${userRecord.uid}`);
        } else {
          throw error;
        }
      }

      const claims: { role: string; schoolId?: string | null } = { role: user.role };
      if (user.schoolId !== undefined) {
        claims.schoolId = user.schoolId;
      }
      await auth.setCustomUserClaims(userRecord.uid, claims);
      console.log(`Successfully set claims for ${user.email} (Actual UID: ${userRecord.uid}):`, claims);
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error);
    }
  }
  console.log("Finished setting custom claims.");
}


export async function seedDatabase() {
    console.log("Starting Firestore data seeding process...");
    
    await setCustomUserClaimsForUsers(adminAuth, usersData);
    
    const firestoreUsersData = usersData.map(u => ({
      id: u.uid,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      schoolId: u.schoolId === undefined ? null : u.schoolId,
    }));
    await seedCollection(adminDb, 'users', firestoreUsersData);
    await seedCollection(adminDb, 'schools', schoolsData);
    await seedCollection(adminDb, 'staff', staffData);
    await seedCollection(adminDb, 'examResults', examResultsData);
    await seedCollection(adminDb, 'disciplinary', disciplinaryRecordsData);
    await seedCollection(adminDb, 'books', libraryBooksData);

    console.log("Firestore data seeding completed successfully!");
}
