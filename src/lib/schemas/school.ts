
import * as z from 'zod';

export const SchoolSchema = z.object({
  id: z.string().min(1, "School ID is required."),
  name: z.string().min(3, "School Name is required."),
  address: z.string().min(5, "Address is required."),
  type: z.string().min(3, "School type is required (e.g., Primary, Secondary)."),
});

export type School = z.infer<typeof SchoolSchema>;
