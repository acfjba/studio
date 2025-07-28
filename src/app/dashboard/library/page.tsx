"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Library,
  PlusCircle,
  AlertCircle,
  Edit2,
  Trash2,
  MailWarning,
  ArrowRightLeft,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookFormSchema,
  LibraryTransactionFormSchema,
  type Book,
  type BookFormData,
  type LibraryTransaction,
  type LibraryTransactionFormData,
} from "@/lib/schemas/library";
import {
  useForm,
  type SubmitHandler,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { db, isFirebaseConfigured } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  query,
  where,
  runTransaction,
} from "firebase/firestore";

/* ------------------------------------------------------------------ */
/*                             Firestore                              */
/* ------------------------------------------------------------------ */

async function fetchBooksFromFirestore(
  schoolId: string,
): Promise<Book[]> {
  if (!db) throw new Error("Firestore is not configured.");

  const booksCollection = collection(db, "books");
  const q = query(booksCollection, where("schoolId", "==", schoolId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt,
    } as Book;
  });
}

async function fetchTransactionsFromFirestore(
  schoolId: string,
): Promise<LibraryTransaction[]> {
  if (!db) throw new Error("Firestore is not configured.");

  const txCollection = collection(db, "transactions");
  const q = query(txCollection, where("schoolId", "==", schoolId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      issuedAt:
        data.issuedAt instanceof Timestamp
          ? data.issuedAt.toDate().toISOString()
          : data.issuedAt,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt,
    } as LibraryTransaction;
  });
}

async function addBookToFirestore(
  data: BookFormData,
  schoolId: string,
): Promise<Book> {
  if (!db) throw new Error("Firestore is not configured.");

  const newBookData = {
    ...data,
    availableCopies: data.totalCopies,
    schoolId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "books"), newBookData);

  return {
    ...newBookData,
    id: docRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function deleteBookFromFirestore(bookId: string): Promise<void> {
  if (!db) throw new Error("Firestore is not configured.");
  await deleteDoc(doc(db, "books", bookId));
}

/* ------------ FIXED: schoolId included in transaction ------------- */
async function issueBookTransaction(
  data: LibraryTransactionFormData,
  bookTitle: string,
  schoolId: string,
): Promise<LibraryTransaction> {
  if (!db) throw new Error("Firestore is not configured.");

  const bookRef = doc(db, "books", data.bookId);
  const transactionRef = doc(collection(db, "transactions"));

  await runTransaction(db, async (transaction) => {
    const bookDoc = await transaction.get(bookRef);
    if (!bookDoc.exists() || bookDoc.data().availableCopies <= 0) {
      throw new Error("Book is not available for loan.");
    }

    transaction.update(bookRef, {
      availableCopies: bookDoc.data().availableCopies - 1,
    });

    const newTransactionData = {
      ...data,
      bookTitle,
      schoolId, // ✅ required
      issuedBy: "librarian_placeholder",
      issuedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    transaction.set(transactionRef, newTransactionData);
  });

  /* object returned to the UI */
  return {
    ...data,
    id: transactionRef.id,
    bookTitle,
    schoolId, // ✅ required
    issuedBy: "librarian_placeholder",
    issuedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function returnBookTransaction(
  transactionId: string,
  bookId: string,
): Promise<void> {
  if (!db) throw new Error("Firestore is not configured.");

  const bookRef = doc(db, "books", bookId);
  const transactionRef = doc(db, "transactions", transactionId);

  await runTransaction(db, async (transaction) => {
    const bookDoc = await transaction.get(bookRef);
    if (bookDoc.exists()) {
      transaction.update(bookRef, {
        availableCopies: (bookDoc.data().availableCopies || 0) + 1,
      });
    }
    transaction.delete(transactionRef);
  });
}

/* ------------------------------------------------------------------ */
/*                              Component                             */
/* ------------------------------------------------------------------ */

export default function LibraryServicePage() {
  const { toast } = useToast();

  const [books, setBooks] = useState<Book[]>([]);
  const [transactions, setTransactions] = useState<LibraryTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  const addBookForm = useForm<BookFormData>({
    resolver: zodResolver(BookFormSchema),
  });
  const transactionForm = useForm<LibraryTransactionFormData>({
    resolver: zodResolver(LibraryTransactionFormSchema),
  });

  /* grab schoolId once client-side localStorage is available */
  useEffect(() => {
    setSchoolId(localStorage.getItem("schoolId"));
  }, []);

  const loadData = useCallback(
    async (currentSchoolId: string) => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const [fetchedBooks, fetchedTransactions] = await Promise.all([
          fetchBooksFromFirestore(currentSchoolId),
          fetchTransactionsFromFirestore(currentSchoolId),
        ]);
        setBooks(fetchedBooks);
        setTransactions(fetchedTransactions);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "An unknown error occurred.";
        setFetchError(msg);
        toast({
          variant: "destructive",
          title: "Error",
          description: msg,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  /* refresh whenever schoolId changes */
  useEffect(() => {
    if (schoolId) loadData(schoolId);
    else if (schoolId === null) setIsLoading(false);
  }, [schoolId, loadData]);

  /* -------------------------------------------------------------- */
  /*                      Form handlers (trimmed)                   */
  /* -------------------------------------------------------------- */

  /* … everything below this comment is exactly the same as before …
     and does not affect the TypeScript error.                      */

  /* ----------------------------------------------------------------
     (Due to length, the remainder of the file is unchanged. If you
     previously modified anything else, keep those edits intact.)
     ---------------------------------------------------------------- */
}
