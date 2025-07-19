'use server';

/**
 * @fileOverview Creates a lesson plan based on user specifications.
 *
 * - generateLessonPlan - A function that generates a detailed lesson plan.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  topic: z.string().describe('The main topic of the lesson (e.g., "Photosynthesis").'),
  gradeLevel: z.number().describe('The grade level for the students (e.g., 10).'),
  subject: z.string().describe('The subject of the lesson (e.g., "Biology").'),
  durationMinutes: z.number().describe('The total duration of the lesson in minutes.'),
  learningObjectives: z
    .array(z.string())
    .describe('A list of what students should be able to do after the lesson.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const GenerateLessonPlanOutputSchema = z.object({
  lessonTitle: z.string().describe('A creative and engaging title for the lesson.'),
  objectives: z.array(z.string()).describe('The specific, measurable learning objectives for the lesson.'),
  materials: z.array(z.string()).describe('A list of materials and resources needed for the lesson.'),
  activities: z.array(
    z.object({
      name: z.string().describe('The name of the activity (e.g., "Introduction", "Group Work").'),
      duration: z.number().describe('The estimated time in minutes for this activity.'),
      description: z.string().describe('A detailed description of the activity.'),
    })
  ).describe('A sequence of activities that make up the lesson.'),
  assessment: z.object({
      method: z.string().describe('The method used to assess student learning (e.g., "Quiz", "Observation").'),
      description: z.string().describe('A description of the assessment task.'),
  }).describe('How student learning will be assessed.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(input: GenerateLessonPlanInput): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLessonPlanPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an expert curriculum developer who creates engaging and effective lesson plans for teachers.

Generate a comprehensive lesson plan for the following request:

Subject: {{{subject}}}
Grade Level: {{{gradeLevel}}}
Topic: {{{topic}}}
Lesson Duration: {{{durationMinutes}}} minutes

The lesson must cover these specific learning objectives:
{{#each learningObjectives}}
- {{{this}}}
{{/each}}

Structure the lesson plan with a clear title, a list of materials, a sequence of timed activities (e.g., introduction, direct instruction, guided practice, independent work, conclusion), and a method for assessing student understanding. The total duration of all activities should match the specified lesson duration.
`,
});

const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
