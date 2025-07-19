
import * as z from 'zod';

export const StaffMemberSchema = z.object({
  staffId: z.string().min(1, 'Staff ID is required.'),
  name: z.string().min(2, 'Name is required.'),
  role: z.string().min(2, 'Role is required.'),
  position: z.string().min(2, 'Position is required.'),
  status: z.string().min(1, 'Status is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().optional(),
  schoolId: z.string(),
});

export type StaffMemberFormData = z.infer<typeof StaffMemberSchema>;

export type StaffMember = z.infer<typeof StaffMemberSchema> & {
    id: string;
    createdAt: string; // ISO Date String
    updatedAt: string; // ISO Date String
};
