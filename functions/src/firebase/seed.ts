// functions/src/firebase/seed.ts
import { adminDb, adminAuth } from './admin';
import {
  usersSeedData,
  schoolData,
  staffData,
  inventoryData,
  sampleExamResultsData,
  libraryBooksData,
  disciplinaryRecordsData,
  counsellingRecordsData,
  ohsRecordsData,
  academicsData,
  healthSafetyData,
  libraryData,
  settingsData,
  contactsData,
  historyData,
  platformManagementData,
  teacherPanelData,
  inviteTeachersData,
  primaryAdminData,
  teachersData,
  documentVaultData,
  iwpData,
  profileData,
  uploadDataData,
  emailData,
  reportingData,
  workbookPlanData,
  headTeacherData,
  lessonPlannerData,
  schoolManagementData
} from '../data/index';

interface SeedReport {
  users: string[];
  schools: string[];
  staff: string[];
  inventory: string[];
  examResults: string[];
  libraryBooks: string[];
  disciplinaryRecords: string[];
  counsellingRecords: string[];
  ohsRecords: string[];
  academics: string[];
  healthSafety: string[];
  libraryCollection: string[];
  settings: string[];
  contacts: string[];
  history: string[];
  platformManagement: string[];
  teacherPanel: string[];
  inviteTeachers: string[];
  primaryAdmin: string[];
  teachers: string[];
  documentVault: string[];
  iwp: string[];
  profile: string[];
  uploadData: string[];
  email: string[];
  reporting: string[];
  workbookPlan: string[];
  headTeacher: string[];
  lessonPlanner: string[];
  schoolManagement: string[];
}

/**
 * Seeds the database with essential data from JSON files.
 * This function is idempotent: it will update existing entries or create
 * them if they don't exist. New collections will be skipped if empty.
 * @returns A report of all actions taken.
 */
export async function seedDatabase(): Promise<SeedReport> {
  console.log("Starting database seed process...");
  if (!adminAuth || !adminDb) {
    throw new Error("Firebase Admin SDK not initialized. Cannot seed database.");
  }
  const auth = adminAuth;
  const db = adminDb;

  const report: SeedReport = {
    users: [], schools: [], staff: [], inventory: [], examResults: [], libraryBooks: [],
    disciplinaryRecords: [], counsellingRecords: [], ohsRecords: [], academics: [], healthSafety: [],
    libraryCollection: [], settings: [], contacts: [], history: [], platformManagement: [], teacherPanel: [],
    inviteTeachers: [], primaryAdmin: [], teachers: [], documentVault: [], iwp: [], profile: [],
    uploadData: [], email: [], reporting: [], workbookPlan: [], headTeacher: [], lessonPlanner: [], schoolManagement: []
  };

  // --- Users ---
  if (usersSeedData.length) {
    console.log(`Processing ${usersSeedData.length} user(s)...`);
    for (const u of usersSeedData) {
      try {
        const { id, email, password, displayName, role, schoolId } = u;
        if (!id || !email || !password || !displayName || !role) {
          report.users.push(`Skipping invalid user entry: ${JSON.stringify(u)}`);
          continue;
        }
        try {
          await auth.getUser(id);
          report.users.push(`Auth user already exists: ${email}`);
        } catch (err: any) {
          if (err.code === 'auth/user-not-found') {
            await auth.createUser({ uid: id, email, password, displayName });
            report.users.push(`Created Auth user: ${email}`);
          } else throw err;
        }
        await db.collection('users').doc(id).set({ id, email, displayName, role, schoolId: schoolId || null });
        report.users.push(`-> Set/updated Firestore document for ${email}`);
      } catch (err: any) {
        report.users.push(`❌ Error processing user ${u.email}: ${err.message}`);
      }
    }
  } else console.log('No users found to seed.');

  // --- All Other Collections ---
  const collectionsToSeed: { name: string; data: any[]; reportKey: keyof SeedReport }[] = [
    { name: 'schools', data: schoolData, reportKey: 'schools' },
    { name: 'staff', data: staffData, reportKey: 'staff' },
    { name: 'inventory', data: inventoryData, reportKey: 'inventory' },
    { name: 'examResults', data: sampleExamResultsData, reportKey: 'examResults' },
    { name: 'libraryBooks', data: libraryBooksData, reportKey: 'libraryBooks' },
    { name: 'disciplinary', data: disciplinaryRecordsData, reportKey: 'disciplinaryRecords' },
    { name: 'counselling', data: counsellingRecordsData, reportKey: 'counsellingRecords' },
    { name: 'ohs', data: ohsRecordsData, reportKey: 'ohsRecords' },
    { name: 'academics', data: academicsData, reportKey: 'academics' },
    { name: 'health-safety', data: healthSafetyData, reportKey: 'healthSafety' },
    { name: 'library', data: libraryData, reportKey: 'libraryCollection' },
    { name: 'settings', data: settingsData, reportKey: 'settings' },
    { name: 'contacts', data: contactsData, reportKey: 'contacts' },
    { name: 'history', data: historyData, reportKey: 'history' },
    { name: 'platform-management', data: platformManagementData, reportKey: 'platformManagement' },
    { name: 'teacher-panel', data: teacherPanelData, reportKey: 'teacherPanel' },
    { name: 'invite-teachers', data: inviteTeachersData, reportKey: 'inviteTeachers' },
    { name: 'primary-admin', data: primaryAdminData, reportKey: 'primaryAdmin' },
    { name: 'teachers', data: teachersData, reportKey: 'teachers' },
    { name: 'document-vault', data: documentVaultData, reportKey: 'documentVault' },
    { name: 'iwp', data: iwpData, reportKey: 'iwp' },
    { name: 'profile', data: profileData, reportKey: 'profile' },
    { name: 'upload-data', data: uploadDataData, reportKey: 'uploadData' },
    { name: 'email', data: emailData, reportKey: 'email' },
    { name: 'reporting', data: reportingData, reportKey: 'reporting' },
    { name: 'workbook-plan', data: workbookPlanData, reportKey: 'workbookPlan' },
    { name: 'head-teacher', data: headTeacherData, reportKey: 'headTeacher' },
    { name: 'lesson-planner', data: lessonPlannerData, reportKey: 'lessonPlanner' },
    { name: 'school-management', data: schoolManagementData, reportKey: 'schoolManagement' }
  ];

  for (const col of collectionsToSeed) {
    if (col.data.length) {
      const batch = db.batch();
      col.data.forEach(item => {
        if (item.id) {
          const ref = db.collection(col.name).doc(item.id);
          batch.set(ref, item, { merge: true }); // Use merge: true to avoid overwriting existing fields unintentionally
          (report[col.reportKey] as string[]).push(`Queued ${item.id} for ${col.name}`);
        }
      });
      console.log(`Queued ${col.data.length} documents for ${col.name}.`);
      await batch.commit();
      console.log(`✅ Batch commit for ${col.name} complete.`);
    } else console.log(`No data for ${col.name}. Skipping.`);
  }

  console.log('\nFull database seeding process complete!');
  return report;
}
