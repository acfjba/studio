// functions/seed-script.ts
import { seedDatabase } from './src/firebase/seed';

seedDatabase()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
