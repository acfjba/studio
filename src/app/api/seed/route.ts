
// src/app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { seedDatabase } from '../../../../functions/src/firebase/seed';


// This function handles POST requests to /api/seed
export async function POST() {
  // In a real production app, you would add authentication and authorization checks here
  // to ensure only authorized administrators can trigger this endpoint.
  // For example:
  // const user = await getAuthenticatedUser();
  // if (!user || user.role !== 'system-admin') {
  //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  // }

  try {
    const report = await seedDatabase();
    return NextResponse.json({ message: 'Database seeded successfully!', report }, { status: 200 });
  } catch (error) {
    console.error("Error during database seeding:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    return NextResponse.json({ message: `Seeding failed: ${errorMessage}` }, { status: 500 });
  }
}

    