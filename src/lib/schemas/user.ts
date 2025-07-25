
import * as z from 'zod';

export const userRoles = ["teacher", "head-teacher", "assistant-head-teacher", "primary-admin", "system-admin", "librarian", "kindergarten"] as const;

export const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  role: z.enum(userRoles),
  schoolId: z.string().nullable(),
});

export const SingleUserFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  role: z.enum(userRoles, { required_error: "A role must be selected."}),
  schoolId: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters."),
}).refine(data => {
    if (data.role !== 'system-admin') {
        return data.schoolId && data.schoolId.trim().length > 0;
    }
    return true;
}, {
    message: "School ID is required for all roles except System Admin.",
    path: ["schoolId"],
});


export type User = z.infer<typeof UserSchema>;
export type UserFormData = z.infer<typeof SingleUserFormSchema>;

export type UserWithPassword = UserFormData & {
  id: string;
  displayName: string;
};
