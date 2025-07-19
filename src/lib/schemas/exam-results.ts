import * as z from 'zod';

export const examTypes = [
  "Quiz",
  "Mid-Term",
  "Final",
  "Standardized Test",
  "Practical Exam",
  "Other"
] as const;

export const ExamResultFormInputSchema = z.object({
  studentId: z.string().min(1, "Student ID is required."),
  studentName: z.string().min(2, "Student name is required."),
  studentYear: z.string().min(1, "Student year is required."),
  examType: z.enum(examTypes, { required_error: "Please select an exam type." }),
  otherExamTypeName: z.string().optional(),
  subject: z.string().min(2, "Subject is required."),
  score: z.string().optional(),
  grade: z.string().optional(),
  examDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "A valid exam date is required." }),
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
    return data.score || data.grade;
}, {
    message: "Either Score or Grade must be provided.",
    path: ["score"], // You can also point to a different or common path
});

export type ExamResultFormData = z.infer<typeof ExamResultFormInputSchema>;

export type ExamResult = ExamResultFormData & {
  id: string;
  recordedByUserId: string;
  schoolId?: string;
  createdAt: string;
  updatedAt: string;
};
