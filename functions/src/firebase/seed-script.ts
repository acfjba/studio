
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
  
  try {
    await seedDatabase();
    console.log('\n--- Database Seeding Completed Successfully! ---');
    process.exit(0);
  } catch (error) {
    console.error('\n--- Database Seeding Failed ---');
    console.error('An error occurred during the seeding process:');
    if (error instanceof Error && error.message.includes('Could not load the default credentials')) {
        console.error('Hint: Make sure your GOOGLE_APPLICATION_CREDENTIALS environment variable is set correctly and points to your service account key file.');
    } else {
        console.error(error);
    }
    process.exit(1);
  }
}

runSeed();
