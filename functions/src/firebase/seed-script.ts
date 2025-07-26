// functions/src/firebase/seed-script.ts

/**
 * This script is for command-line seeding for testing and development purposes.
 * It directly invokes the seedDatabase function.
 * To run this script, use the command: `npm run db:seed`
 */
import { config } from 'dotenv';
import { seedDatabase } from './seed';
import path from 'path';

// Load environment variables from .env file at the project root
config({ path: path.resolve(__dirname, '../../../../.env') });

async function runSeed() {
  console.log('--- Starting Database Seed via Command Line ---');

  // Check for necessary environment variables to connect to Firebase Admin
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
      console.error('\nERROR: Firebase Admin credentials not found in .env file.');
      console.error('For local seeding, please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your .env file.');
      console.log('You can get these values from your project\'s service account JSON key file in the Firebase Console.');
      process.exit(1);
  }
  
  try {
    await seedDatabase();
    console.log('\n--- Database Seeding Completed Successfully! ---');
    process.exit(0);
  } catch (error) {
    console.error('\n--- Database Seeding Failed ---');
    console.error('An error occurred during the seeding process:');
    console.error(error);
    process.exit(1);
  }
}

runSeed();
