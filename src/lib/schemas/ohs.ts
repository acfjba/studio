
import * as z from 'zod';

export const OhsRecordSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  incidentDate: z.string(), // ISO Date String
  reportedBy: z.string(), // User ID or name
  compiledBy: z.string(), // User ID or name
  notifiedTo: z.array(z.string()), // e.g., ['Ministry of Education', 'Police']
  ambulanceCalled: z.boolean(),
  headReport: z.string(), // Detailed description
  actionTaken: z.string(),
  parentsNotified: z.enum(["Yes", "No", "Attempted", "Not Required"]),
  createdAt: z.string(), // ISO Date String
  updatedAt: z.string(), // ISO Date String
});

export type OhsRecord = z.infer<typeof OhsRecordSchema>;
