
import * as z from 'zod';

export const counsellingTypes = [
  "Academic",
  "Behavioral",
  "Family Issues",
  "Peer Conflict",
  "Mental Health",
  "Career Guidance",
  "Grief/Loss",
  "Other"
] as const;

export const CounsellingRecordFormInputSchema = z.object({
  sessionDate: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "A valid session date is required." }),
  studentName: z.string().min(2, { message: "Student name is required." }),
  studentId: z.string().min(1, { message: "Student ID is required." }),
  studentDob: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "A valid date of birth is required." }),
  studentYear: z.string().min(1, { message: "Student year level is required." }),
  counsellingType: z.enum(counsellingTypes, { required_error: "Please select a counselling type." }),
  otherCounsellingType: z.string().optional(),
  sessionDetails: z.string().min(20, { message: "Session details must be at least 20 characters long." }),
  actionPlan: z.string().min(10, { message: "Action plan must be at least 10 characters long." }),
  parentsContacted: z.enum(["Yes", "No", "Attempted", "Not Required"], { required_error: "Please select parent contact status." }),
  counsellorName: z.string().min(2, { message: "Counsellor name is required." }),
}).superRefine((data, ctx) => {
    if (data.counsellingType === 'Other' && (!data.otherCounsellingType || data.otherCounsellingType.trim().length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify the 'Other' counselling type when selected.",
        path: ["otherCounsellingType"],
      });
    }
});

export type CounsellingRecordFormData = z.infer<typeof CounsellingRecordFormInputSchema>;

export type CounsellingRecord = CounsellingRecordFormData & {
  id: string;
  schoolId: string;
  userId: string; // User ID of the counsellor who created the record
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
};
