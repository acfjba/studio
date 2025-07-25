
// functions/src/firebase/seed.ts
import { writeBatch, doc } from 'firebase/firestore';
import { adminDb, adminAuth } from './admin';
import { usersSeedData } from '../data';

export async function seedDatabase() {
  console.log("Starting database seed process...");

  // ---------- Users + Auth Claims ----------
  console.log("Processing essential users...");

  if (!usersSeedData || usersSeedData.length === 0) {
    console.log("No users found in users.json. Skipping user seeding.");
    return;
  }

  const userProcessingPromises = usersSeedData.map(async (u) => {
    try {
      const { id, email, password, displayName, role, schoolId } = u;

      if (!id || !email || !password || !displayName || !role) {
        console.error(`Skipping invalid user entry: ${JSON.stringify(u)}`);
        return;
      }
      
      let userRecord;
      try {
        userRecord = await adminAuth.getUser(id);
        // User exists, update them
        await adminAuth.updateUser(userRecord.uid, {
          email: email,
          password: password,
          displayName: displayName,
        });
        console.log(`Updated Auth user: ${email}`);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // User does not exist, create them
          userRecord = await adminAuth.createUser({ 
            uid: id,
            email: email, 
            displayName: displayName,
            password: password,
          });
          console.log(`Created new Auth user: ${email}`);
        } else {
          // Re-throw other errors
          throw error;
        }
      }

      // Set custom claims for role-based access
      const claims = { role, schoolId: schoolId ?? null };
      await adminAuth.setCustomUserClaims(userRecord.uid, claims);
      console.log(`Set custom claims for ${email}:`, claims);
      
      // Set user document in Firestore with the CORRECT field names
      const userDocRef = doc(adminDb, 'users', id);
      const userDocPayload = {
        email: email,
        displayName: displayName, // Correct field
        role: role,             // Correct field
        schoolId: schoolId ?? null,
      };
      
      await adminDb.collection("users").doc(id).set(userDocPayload);
      console.log(`Set Firestore document for user: ${id} in collection 'users'`);

    } catch (error) {
      console.error(`Error processing user ${u.email}:`, error);
    }
  });

  await Promise.all(userProcessingPromises);
  console.log('User seeding process complete!');
}
