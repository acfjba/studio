
import * as z from 'zod';

export const StaffMemberFormDataSchema = z.object({
  staffId: z.string().min(1, 'Staff ID is required.'),
  name: z.string().min(2, 'Name is required.'),
  role: z.string().min(2, 'Role is required.'),
  position: z.string().min(2, 'Position is required.'),
  status: z.string().min(1, 'Status is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().optional(),
});

export const StaffMemberSchema = StaffMemberFormDataSchema.extend({
    id: z.string(),
    schoolId: z.string(),
    createdAt: z.string(), // ISO Date String
    updatedAt: z.string(), // ISO Date String
});

export type StaffMember = z.infer<typeof StaffMemberSchema>;
