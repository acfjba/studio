"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Library, PlusCircle, AlertCircle, Edit2, Trash2, MailWarning, ArrowRightLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { BookFormSchema, LibraryTransactionFormSchema, type Book, type BookFormData, type LibraryTransaction, type LibraryTransactionFormData } from "@/lib/schemas/library";
import { sampleLibraryBooksData } from '@/lib/seed-data';
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from '@/components/layout/page-header';

// --- Simulated Backend Functions ---
async function fetchBooksFromBackend(schoolId?: string): Promise<Book[]> {
  console.log("Simulating fetch books from backend...", { schoolId });
  await new Promise(resolve => setTimeout(resolve, 500));
  return JSON.parse(JSON.stringify(sampleLibraryBooksData));
}

export default function LibraryServicePage() {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [transactions, setTransactions] = useState<LibraryTransaction[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const addBookForm = useForm<BookFormData>({
    resolver: zodResolver(BookFormSchema)
  });

  const transactionForm = useForm<LibraryTransactionFormData>({
    resolver: zodResolver(LibraryTransactionFormSchema)
  });


  useEffect(() => {
    const loadBooks = async () => {
      setIsLoadingBooks(true);
      setFetchError(null);
      try {
        const schoolId = localStorage.getItem('schoolId') || undefined;
        const fetchedBooks = await fetchBooksFromBackend(schoolId);
        setBooks(fetchedBooks);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An unknown error occurred.";
        setFetchError(errorMsg);
        toast({ variant: "destructive", title: "Error", description: errorMsg });
      } finally {
        setIsLoadingBooks(false);
      }
    };
    loadBooks();
  }, [toast]);

  const handleAddBookSubmit: SubmitHandler<BookFormData> = async (data) => {
    console.log("Adding new book (simulated):", data);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newBook: Book = {
      id: `book_${Date.now()}`,
      ...data,
      availableCopies: data.totalCopies,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBooks(prevBooks => [newBook, ...prevBooks]);
    toast({ title: "Book Added", description: `"${data.title}" has been added to the catalogue.`});
    setIsAddBookModalOpen(false);
    addBookForm.reset();
  };
  
  const handleTransactionSubmit: SubmitHandler<LibraryTransactionFormData> = async (data) => {
    const bookToLoan = books.find(b => b.id === data.bookId);

    if (!bookToLoan) {
        toast({ variant: "destructive", title: "Error", description: "Selected book not found." });
        return;
    }

    if (bookToLoan.availableCopies <= 0) {
        toast({ variant: "destructive", title: "Unavailable", description: `No copies of "${bookToLoan.title}" are available.` });
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTransaction: LibraryTransaction = {
        ...data,
        id: `txn_${Date.now()}`,
        bookTitle: bookToLoan.title,
        issuedBy: "librarian_placeholder",
        issuedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);

    setBooks(prevBooks => 
        prevBooks.map(book => 
            book.id === data.bookId 
                ? { ...book, availableCopies: book.availableCopies - 1 }
                : book
        )
    );

    toast({ title: "Transaction Successful", description: `"${bookToLoan.title}" issued to ${data.memberName}.` });
    setIsTransactionModalOpen(false);
    transactionForm.reset();
  };

  const handleMarkAsReturned = (transactionId: string, bookId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    setBooks(prevBooks =>
        prevBooks.map(book => 
            book.id === bookId
                ? { ...book, availableCopies: (book.availableCopies || 0) + 1 }
                : book
        )
    );
    toast({ title: "Book Returned", description: "The book has been marked as returned." });
  };

  const handleSimulatedEdit = (title: string) => {
    toast({ title: "Action Simulated", description: `Edit for "${title}" would open a pre-filled form here.` });
  };

  const handleSimulatedDelete = (bookId: string, bookTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"? This is a simulated action.`)) {
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      toast({ title: "Book Deleted (Simulated)", description: `"${bookTitle}" has been removed from the list.` });
    }
  };

  const availableBooksForLoan = books.filter(b => b.availableCopies > 0);
  const yearOptions = Array.from({ length: 13 }, (_, i) => `Year ${i + 1}`);

  return (
      <div className="flex flex-col gap-8">
        <PageHeader 
            title="Library Service"
            description="Manage the school's book catalogue and handle loans and returns."
        />

        <section id="book-catalogue" className="p-4 border border-border rounded-lg shadow-md bg-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-headline text-primary">Book Catalogue</h2>
            <Dialog open={isAddBookModalOpen} onOpenChange={setIsAddBookModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => addBookForm.reset()}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Book
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Book</DialogTitle>
                  <DialogDescription>
                    Fill in the details of the new book to add it to the library catalogue.
                  </DialogDescription>
                </DialogHeader>
                <form id="add-book-form" onSubmit={addBookForm.handleSubmit(handleAddBookSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...addBookForm.register("title")} />
                    {addBookForm.formState.errors.title && <p className="text-destructive text-sm mt-1">{addBookForm.formState.errors.title.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" {...addBookForm.register("author")} />
                    {addBookForm.formState.errors.author && <p className="text-destructive text-sm mt-1">{addBookForm.formState.errors.author.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" {...addBookForm.register("category")} />
                    {addBookForm.formState.errors.category && <p className="text-destructive text-sm mt-1">{addBookForm.formState.errors.category.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="isbn">ISBN (Optional)</Label>
                    <Input id="isbn" {...addBookForm.register("isbn")} />
                    {addBookForm.formState.errors.isbn && <p className="text-destructive text-sm mt-1">{addBookForm.formState.errors.isbn.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="totalCopies">Total Copies</Label>
                    <Input id="totalCopies" type="number" {...addBookForm.register("totalCopies")} />
                    {addBookForm.formState.errors.totalCopies && <p className="text-destructive text-sm mt-1">{addBookForm.formState.errors.totalCopies.message}</p>}
                  </div>
                </form>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" form="add-book-form" disabled={addBookForm.formState.isSubmitting}>
                    {addBookForm.formState.isSubmitting ? 'Adding...' : 'Add Book'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {isLoadingBooks ? <Skeleton className="h-48 w-full" /> : fetchError ? (
            <p className="text-destructive font-body">{fetchError}</p>
          ) : books.length === 0 ? (
            <Card className="bg-muted/30 border-primary/20 py-6">
              <CardContent className="text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-body text-sm text-foreground">No books found in the catalogue.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Available</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-body">
                  {books.map(book => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.category}</TableCell>
                      <TableCell className="text-center">{book.availableCopies}</TableCell>
                      <TableCell className="text-center">{book.totalCopies}</TableCell>
                      <TableCell className="text-center space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleSimulatedEdit(book.title)}><Edit2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => book.id && handleSimulatedDelete(book.id, book.title)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        <section id="new-transaction" className="mb-8 p-4 border border-border rounded-lg shadow-md bg-card">
          <h2 className="text-2xl font-headline text-primary mb-4">New Transaction</h2>
          <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">
                  <ArrowRightLeft className="mr-2 h-5 w-5" />
                  Issue a New Book
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Issue a Book</DialogTitle>
                    <DialogDescription>
                        Fill in the borrower's and book details to issue a new book.
                    </DialogDescription>
                </DialogHeader>
                <form id="transaction-form" onSubmit={transactionForm.handleSubmit(handleTransactionSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="memberName">Member Name</Label>
                      <Input id="memberName" {...transactionForm.register("memberName")} />
                      {transactionForm.formState.errors.memberName && <p className="text-destructive text-sm mt-1">{transactionForm.formState.errors.memberName.message}</p>}
                    </div>
                     <div>
                      <Label htmlFor="memberEmail">Member Email</Label>
                      <Input id="memberEmail" type="email" {...transactionForm.register("memberEmail")} />
                      {transactionForm.formState.errors.memberEmail && <p className="text-destructive text-sm mt-1">{transactionForm.formState.errors.memberEmail.message}</p>}
                    </div>
                     <div>
                      <Label htmlFor="memberPhone">Member Phone</Label>
                      <Input id="memberPhone" type="tel" {...transactionForm.register("memberPhone")} />
                      {transactionForm.formState.errors.memberPhone && <p className="text-destructive text-sm mt-1">{transactionForm.formState.errors.memberPhone.message}</p>}
                    </div>
                     <div>
                      <Label htmlFor="memberRole">Member Role</Label>
                      <Controller name="memberRole" control={transactionForm.control} render={({field}) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger id="memberRole"><SelectValue placeholder="Select role..." /></SelectTrigger>
                          <SelectContent><SelectItem value="Student">Student</SelectItem><SelectItem value="Teacher">Teacher</SelectItem></SelectContent>
                        </Select>
                      )} />
                       {transactionForm.formState.errors.memberRole && <p className="text-destructive text-sm mt-1">{transactionForm.formState.errors.memberRole.message}</p>}
                    </div>
                     <div>
                      <Label htmlFor="schoolYear">School Year / Class</Label>
                      <Controller name="schoolYear" control={transactionForm.control} render={({field}) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger id="schoolYear"><SelectValue placeholder="Select year..." /></SelectTrigger>
                          <SelectContent>{yearOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                        </Select>
                      )} />
                       {transactionForm.formState.errors.schoolYear && <p className="text-destructive text-sm mt-1">{transactionForm.formState.errors.schoolYear.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="bookId">Book to Issue</Label>
                        <Controller name="bookId" control={transactionForm.control} render={({field}) => (
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <SelectTrigger id="bookId"><SelectValue placeholder="Select a book..." /></SelectTrigger>
                               <SelectContent>
                                   {availableBooksForLoan.map(book => <SelectItem key={book.id} value={book.id!}>{book.title} ({book.availableCopies} available)</SelectItem>)}
                               </SelectContent>
                           </Select>
                        )} />
                        {transactionForm.formState.errors.bookId && <p className="text-destructive text-sm mt-1">{transactionForm.formState.errors.bookId.message}</p>}
                    </div>
                     <div>
                      <Label htmlFor="dueAt">Due Date</Label>
                      <Input id="dueAt" type="date" {...transactionForm.register("dueAt")} />
                      {transactionForm.formState.errors.dueAt && <p className="text-destructive text-sm mt-1">{transactionForm.formState.errors.dueAt.message}</p>}
                    </div>
                  </div>
                </form>
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" form="transaction-form" disabled={transactionForm.formState.isSubmitting}>
                      {transactionForm.formState.isSubmitting ? 'Issuing...' : 'Issue Book'}
                  </Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <section id="transaction-log" className="p-4 border border-border rounded-lg shadow-md bg-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-2xl font-headline text-primary mb-2 sm:mb-0">Transaction Log</h2>
            <Button onClick={() => toast({title: "Reminder action simulated"})} >
              <MailWarning className="mr-2 h-5 w-5" />Send Overdue Reminders
            </Button>
          </div>
           {isLoadingBooks ? <Skeleton className="h-24 w-full" /> : transactions.length === 0 ? (
            <Card className="bg-muted/30 border-primary/20 py-6">
                <CardContent className="text-center">
                    <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                    <p className="font-body text-sm text-foreground">No active transactions.</p>
                </CardContent>
            </Card>
           ) : (
            <div className="overflow-x-auto max-h-96">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Book Title</TableHead>
                            <TableHead>Issued To</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map(txn => (
                            <TableRow key={txn.id}>
                                <TableCell className="font-medium">{txn.bookTitle}</TableCell>
                                <TableCell>{txn.memberName}</TableCell>
                                <TableCell>{new Date(txn.dueAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-center">
                                    <Button size="sm" onClick={() => handleMarkAsReturned(txn.id!, txn.bookId)}>
                                        Mark as Returned
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
           )}
        </section>
      </div>
  );
}
