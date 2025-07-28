
'use server';

import { NextResponse } from 'next/server';
import { seedDatabase } from '@/functions/src/firebase/seed';

/**
 * This API route triggers the database seeding process.
 * It's intended for development and setup purposes.
 * It is recommended to use the CLI script `npm run db:seed` for local development.
 */
export async function POST() {
  // Add a more robust security check in a real-world production app
  // For instance, check for a secret header or ensure it's a trusted IP.
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Seeding is only allowed in development environment.' }, { status: 403 });
  }

  try {
    console.log('API route /api/seed called. Starting database seed process...');
    const report = await seedDatabase();
    console.log('Seeding completed via API.');
    return NextResponse.json({
      message: 'Database seeded successfully!',
      report,
    });
  } catch (error: unknown) {
    console.error('Error during database seeding via API:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    // The error might be verbose, so we log it on the server and send a cleaner message.
    return NextResponse.json(
      { 
        error: 'Database seeding failed.',
        details: errorMessage,
      }, 
      { status: 500 }
    );
  }
}
