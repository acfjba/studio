
import * as z from 'zod';

export const LessonPlanSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string(),
  teacherId: z.string(), // User ID of the teacher
  subject: z.string().min(3, { message: "Subject is required." }),
  topic: z.string().min(3, { message: "Topic is required." }),
  term: z.string().min(1, { message: "Term is required." }),
  week: z.string().min(1, { message: "Week is required." }),
  objectives: z.string().min(10, { message: "Objectives must be at least 10 characters." }),
  activities: z.string().min(10, { message: "Activities must be at least 10 characters." }),
  resources: z.string().min(5, { message: "Resources must be at least 5 characters." }),
  assessment: z.string().min(5, { message: "Assessment methods must be at least 5 characters." }),
  createdAt: z.string(), // ISO Date String
  updatedAt: z.string(), // ISO Date String
});

export type LessonPlanFormData = z.infer<typeof LessonPlanSchema>;
