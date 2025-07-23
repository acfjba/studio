// src/lib/firebase/seed-script.ts

/**
 * This script is for command-line seeding for testing and development purposes.
 * It directly invokes the seedDatabase function.
 * To run this script, use the command: `npm run db:seed`
 */
import { config } from 'dotenv';
import { seedDatabase } from './server/seed';

// Load environment variables from .env file
config({ path: '.env' });

async function runSeed() {
  console.log('--- Starting Database Seed via Command Line ---');

  // Check for necessary environment variables to connect to Firebase Admin
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && (!process.env.GCLOUD_PROJECT && !process.env.FUNCTIONS_EMULATOR)) {
      console.error('\nERROR: Firebase Admin credentials not found.');
      console.error('For local seeding, please ensure you have the GOOGLE_APPLICATION_CREDENTIALS environment variable set.');
      console.log('Refer to Firebase documentation on setting up a service account for local development.');
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
