
'use server';

import { z } from 'zod';

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
