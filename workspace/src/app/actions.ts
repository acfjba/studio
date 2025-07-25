
'use server';

import { z } from 'zod';
import { seedDatabase } from '../../functions/src/firebase/seed';

// Define the schema for the feedback form
const feedbackSchema = z.object({
  message: z.string().min(10, { message: 'Feedback must be at least 10 characters long.' }),
});

/**
 * Server Action to handle feedback form submission.
 * This function runs only on the server.
 * @param prevState - The previous state of the form.
 * @param formData - The new form data submitted by the user.
 * @returns An object with a message and an error flag.
 */
export async function submitFeedback(prevState: { message: string, error: boolean }, formData: FormData) {
  const validatedFields = feedbackSchema.safeParse({
    message: formData.get('message'),
  });

  // If validation fails, return the error message
  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.message?.[0] || "Invalid input.",
      error: true,
    };
  }
  
  // If validation succeeds, process the data
  // In a real app, you would save this to a database (e.g., Firestore)
  console.log('--- SERVER ACTION ---');
  console.log('Received feedback:', validatedFields.data.message);
  console.log('---------------------');
  
  // You can add database logic here. For example:
  // await db.collection('feedback').add({ 
  //   message: validatedFields.data.message, 
  //   submittedAt: new Date() 
  // });

  return { message: 'Thank you for your feedback! It has been received successfully.', error: false };
}


/**
 * Server Action to trigger database seeding.
 * This action is now deprecated and seeding must be done via the command line.
 * @returns An object with a success message or an error.
 */
export async function seedDatabaseAction(): Promise<{ success: boolean; message: string }> {
    console.warn("Seeding from the web UI is not supported in this architecture. Please use `npm run db:seed` from the terminal.");
    return { success: false, message: "This feature must be run from the command line. See server logs for details." };
}
