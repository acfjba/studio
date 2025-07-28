// functions/src/firebase/seed-script.ts
import { seedDatabase } from './seed';

/**
 * This script is for command-line seeding for testing and development purposes.
 * It directly invokes the seedDatabase function.
 * To run this script, use the command: `npm run db:seed`
 */
(async () => {
  try {
    console.log('--- Starting Database Seed via Command Line ---');
    await seedDatabase();
    console.log('--- Database Seeding Completed Successfully! ---');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Seed Failed:', error.message);
    process.exit(1);
  }
})();
