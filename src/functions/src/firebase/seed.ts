

/**
 * @fileOverview Firestore Seeding Script for School Users from CSV.
 *
 * This script reads a CSV file containing user data and seeds Firebase
 * Authentication and Firestore. It's designed to be idempotent, meaning
 * it can be run multiple times without creating duplicate users.
 */
import fs from "fs";
import csvParser from "csv-parser";
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { adminDb, adminAuth } from './admin';

/**
 * Reads and parses a CSV file into an array of objects.
 * @param path - The absolute path to the CSV file.
 * @returns A promise that resolves to an array of row objects.
 */
function readCsv(path: string): Promise<any[]> {
  const rows: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csvParser())
      .on("data", row => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

/**
 * Normalizes a row from the CSV file, trimming whitespace and setting defaults.
 * @param r - The raw row object from the CSV parser.
 * @returns A normalized row object.
 */
function normalizeRow(r: any) {
  return {
    email:     (r.email     || "").trim().toLowerCase(),
    name:      (r.name      || "").trim(),
    role:      (r.role      || "teacher").trim().toLowerCase().replace(/\s+/g, "-"),
    schoolId:  (r.schoolId  || "").trim(),
    password:  (r.password  || "Welcome123!").trim()
  };
}

/**
 * Main seeding routine.
 * Iterates through CSV rows and seeds users into Firebase.
 * @param csvPath - The absolute path to the CSV file.
 */
export async function seedUsersFromCsv(csvPath: string): Promise<void> {
  console.log(`\n📥 Reading ${csvPath} …`);
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at path: ${csvPath}`);
  }
  const rawRows = await readCsv(csvPath);
  const rows = rawRows.map(normalizeRow).filter(r => r.email && r.schoolId);
  console.log(`   → Found ${rows.length} valid rows to process\n`);

  for (const r of rows) {
    let user;
    try {
      // 1. Check if user exists in Auth, if so update, otherwise create.
      try {
        user = await adminAuth.getUserByEmail(r.email);
        await adminAuth.updateUser(user.uid, {
          displayName: r.name,
          password:     r.password
        });
        console.log(`📝 Updated Auth user  ${r.email}  (uid=${user.uid})`);
      } catch (e: any) {
        if (e.code === "auth/user-not-found") {
          user = await adminAuth.createUser({
            email:        r.email,
            password:     r.password,
            displayName:  r.name
          });
          console.log(`➕ Created Auth user  ${r.email}  (uid=${user.uid})`);
        } else {
          throw e; // Rethrow other auth errors
        }
      }

      // 2. Set Custom Claims for Firebase Rules (CRITICAL STEP)
      // This must run every time to ensure claims are consistent with the CSV.
      await adminAuth.setCustomUserClaims(user.uid, { role: r.role, schoolId: r.schoolId });
      
      // 3. Slim top-level profile (optional but handy for rule checks)
      await adminDb.collection("users").doc(user.uid).set(
        {
          email: r.email,
          role:  r.role,
          schoolId: r.schoolId
        },
        { merge: true }
      );

      // 4. Full profile under the school path
      await adminDb.collection("schools").doc(r.schoolId)
        .collection("users").doc(user.uid)
        .set(
          {
            email:        r.email,
            displayName:  r.name,
            name: r.name, // Add name for consistency
            role:         r.role,
            schoolId:     r.schoolId,
            status: 'active',
            position: r.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            tpfNumber: `TPF-${user.uid}`,
            createdAt:    FieldValue.serverTimestamp(),
            updatedAt:    FieldValue.serverTimestamp()
          },
          { merge: true }
        );

      console.log(`   🔹 Seeded /schools/${r.schoolId}/users/${user.uid}`);

    } catch (err: any) {
      console.error(`⚠️  Failed to process row for ${r.email}:`, err.message);
      continue; // Continue to next row on error
    }
  }

  console.log("\n✅ All school users from CSV seeded.\n");
}
