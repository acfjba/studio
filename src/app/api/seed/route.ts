
import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/firebase/seed';

// This function handles POST requests to /api/seed
export async function POST() {
  try {
    // The seedDatabase function is now called securely on the server-side.
    await seedDatabase();
    // Return a success response
    return NextResponse.json({ message: 'Database seeded successfully!' }, { status: 200 });
  } catch (error) {
    // Log the error on the server for debugging
    console.error("Error seeding database:", error);
    
    // Determine the error message
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";

    // Return an error response
    return NextResponse.json({ message: `Seeding failed: ${errorMessage}` }, { status: 500 });
  }
}
