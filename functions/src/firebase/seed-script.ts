// functions/src/firebase/seed-script.ts
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { seed } from './seed';
import * as process from 'process';

async function main() {
  console.log('🔑 Initializing Firebase Admin SDK…');

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    // When you export the entire JSON into an env var:
    const creds = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    initializeApp({ credential: cert(creds) });
  } else {
    // Fallback to GOOGLE_APPLICATION_CREDENTIALS pointing at a file path
    initializeApp({ credential: applicationDefault() });
  }

  console.log('🚀 Starting database seed…');
  try {
    const report = await seed();
    console.log('✅ Database seeded successfully!');
    console.dir(report, { depth: null, colors: true });
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

main();
