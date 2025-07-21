
import * as z from 'zod';

export const issueTypes = ['Absent', 'Drug', 'Bullying', 'Vandalism', 'Disrespect', 'Other'] as const;

export const DisciplinaryRecordSchema = z.object({
  incidentDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "A valid incident date is required." }),
  studentName: z.string().min(2, { message: "Student name is required." }),
  studentId: z.string().min(1, { message: "Student ID is required." }),
  studentDob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "A valid date of birth is required." }),
  studentYear: z.string().min(1, { message: "Student year level is required." }),
  issues: z.array(z.enum(issueTypes)).min(1, { message: "At least one issue must be selected." }),
  drugType: z.string().optional(),
  otherIssue: z.string().optional(),
  comments: z.string().min(10, { message: "Comments must be at least 10 characters long." }),
  raisedBy: z.string().min(2, { message: "The name of the person who raised the issue is required." }),
  parentsInformed: z.enum(["Yes", "No", "Attempted"], { required_error: "Please select parent contact status." }),
  actionComments: z.string().min(10, { message: "Action comments must be at least 10 characters long." }),
}).superRefine((data, ctx) => {
    if (data.issues.includes('Drug') && (!data.drugType || data.drugType.trim().length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify the type of drug when 'Drug' is selected.",
        path: ["drugType"],
      });
    }
    if (data.issues.includes('Other') && (!data.otherIssue || data.otherIssue.trim().length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please describe the 'Other' issue when selected.",
        path: ["otherIssue"],
      });
    }
});


export type DisciplinaryRecordFormData = z.infer<typeof DisciplinaryRecordSchema>;

export type DisciplinaryRecord = DisciplinaryRecordFormData & {
  id: string;
  schoolId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
