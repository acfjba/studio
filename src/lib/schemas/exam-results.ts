
import * as z from 'zod';

export const examTypes = [
  "Quiz",
  "Mid-Term",
  "Final",
  "Standardized Test",
  "Practical Exam",
  "LANA",
  "Trial",
  "Other"
] as const;

export const ExamResultFormInputSchema = z.object({
  studentId: z.string().min(1, "Student ID is required."),
  studentName: z.string().min(2, "Student name is required."),
  studentYear: z.string().min(1, "Student year is required."),
  examType: z.enum(examTypes, { required_error: "Please select an exam type." }),
  otherExamTypeName: z.string().optional(),
  subject: z.string().min(2, "Subject is required."),
  score: z.coerce.number().optional(),
  grade: z.string().optional(),
  examDate: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "A valid exam date is required." }),
  term: z.string().min(1, "Term is required."),
  year: z.string().min(4, "Academic year is required."),
  comments: z.string().optional(),
}).refine(data => {
    if (data.examType === 'Other') {
        return data.otherExamTypeName && data.otherExamTypeName.trim().length > 0;
    }
    return true;
}, {
    message: "Please specify the 'Other' exam type name.",
    path: ["otherExamTypeName"],
}).refine(data => {
    // Check if score is a number (and not NaN) or if grade is a non-empty string.
    return (data.score !== undefined && !isNaN(data.score)) || (data.grade && data.grade.trim() !== '');
}, {
    message: "Either Score or a non-empty Grade must be provided.",
    path: ["score"], // Point to the first field in the group for error display
});

// This is the type for the form itself before submitting to the backend
export type ExamResultFormData = z.infer<typeof ExamResultFormInputSchema>;

// This is the final type for the data as it's stored in Firestore
export type ExamResult = ExamResultFormData & {
  id: string;
  recordedByUserId: string;
  schoolId: string;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
};
