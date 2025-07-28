
'use server';

import { NextResponse } from 'next/server';
import { seedDatabase } from '@/functions/src/firebase/seed';

/**
 * This API route triggers the database seeding process.
 * It's intended for development and setup purposes.
 */
export async function POST() {
  // Check for a secret or specific condition in a real-world production app for security
  if (process.env.NODE_ENV !== 'development') {
    // Basic protection to prevent accidental seeding in production
    // return NextResponse.json({ error: 'Seeding is only allowed in development environment.' }, { status: 403 });
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
    console.error('Error during database seeding:', error);
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
