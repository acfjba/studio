
import * as z from 'zod';

export const BookFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  author: z.string().min(3, "Author must be at least 3 characters."),
  category: z.string().min(2, "Category is required."),
  isbn: z.string().optional(),
  totalCopies: z.coerce.number().int().min(1, "Total copies must be at least 1."),
});

export type BookFormData = z.infer<typeof BookFormSchema>;

export type Book = BookFormData & {
  id: string;
  schoolId: string;
  availableCopies: number;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
};

export const LibraryTransactionFormSchema = z.object({
  memberName: z.string().min(2, "Member name is required."),
  memberEmail: z.string().email("Please enter a valid email."),
  memberPhone: z.string().min(5, "Please enter a valid phone number."),
  memberRole: z.enum(["Student", "Teacher"], { required_error: "Member role is required." }),
  schoolYear: z.string().min(1, "School year/class is required."),
  bookId: z.string().min(1, "A book must be selected."),
  dueAt: z.string().refine(val => val && !isNaN(Date.parse(val)), { message: "A valid due date is required." }),
});

export type LibraryTransactionFormData = z.infer<typeof LibraryTransactionFormSchema>;

export type LibraryTransaction = LibraryTransactionFormData & {
  id: string;
  schoolId: string;
  bookTitle: string;
  issuedBy: string; // User ID
  issuedAt: string; // ISO Date String
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
};
