
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeartHandshake, Search as SearchIcon, Printer, AlertCircle, Edit3, Trash2, PlusCircle, Save, Mail, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CounsellingRecordFormInputSchema, counsellingTypes, type CounsellingRecord, type CounsellingRecordFormData } from "@/lib/schemas/counselling";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/layout/page-header';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp, query, where } from 'firebase/firestore';


// --- Firestore Actions ---
async function fetchCounsellingRecordsFromFirestore(schoolId: string): Promise<CounsellingRecord[]> {
    if (!db) throw new Error("Firestore is not configured.");
    const recordsCollectionRef = collection(db, 'counselling');
    
    const q = query(recordsCollectionRef, where("schoolId", "==", schoolId));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            sessionDate: data.sessionDate,
            studentDob: data.studentDob,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        } as CounsellingRecord;
    });
}

async function saveCounsellingRecordToFirestore(record: Omit<CounsellingRecord, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, id?: string): Promise<CounsellingRecord> {
    if (!db) throw new Error("Firestore is not configured.");
    
    const recordWithUser = { ...record, userId: "currentUserPlaceholderId" };

    if (id) {
        const docRef = doc(db, 'counselling', id);
        const dataToUpdate = { ...recordWithUser, updatedAt: serverTimestamp() };
        await updateDoc(docRef, dataToUpdate);
        return { ...recordWithUser, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    } else {
        const collectionRef = collection(db, 'counselling');
        const dataToAdd = { ...recordWithUser, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
        const docRef = await addDoc(collectionRef, dataToAdd);
        return { ...recordWithUser, id: docRef.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    }
}

async function deleteCounsellingRecordFromFirestore(id: string): Promise<void> {
    if (!db) throw new Error("Firestore is not configured.");
    const docRef = doc(db, 'counselling', id);
    await deleteDoc(docRef);
}

const generateYearOptions = () => {
    const options = [{ value: "Kindergarten", label: "Kindergarten" }];
    for (let year = 1; year <= 8; year++) {
        for (let cluster = 1; cluster <= 4; cluster++) {
            const value = `${year}0${cluster}`;
            options.push({ value: value, label: `Year ${year} - Cluster ${value}` });
        }
    }
    return options;
};

export default function CounsellingPage() {
  const { toast } = useToast();
  const [records, setRecords] = useState<CounsellingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [displayRecordId, setDisplayRecordId] = useState('');

  // Search state
  const [searchName, setSearchName] = useState('');
  const [searchDob, setSearchDob] = useState('');
  const [searchResults, setSearchResults] = useState<CounsellingRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('schoolId');
      if (id) {
        setSchoolId(id);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<CounsellingRecordFormData>({
    resolver: zodResolver(CounsellingRecordFormInputSchema),
    defaultValues: {
      sessionDate: '',
      studentName: '',
      studentId: '',
      studentDob: '',
      studentYear: '',
      counsellingType: undefined,
      otherCounsellingType: '',
      sessionDetails: '',
      actionPlan: '',
      parentsContacted: undefined,
      counsellorName: '',
    },
  });

  const watchedCounsellingType = watch("counsellingType");
  const showOtherCounsellingType = watchedCounsellingType === 'Other';
  
  const handleSearchRecords = useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!schoolId) {
      toast({ title: "Cannot Search", description: "School ID not available." });
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    
    try {
        const sourceData = await fetchCounsellingRecordsFromFirestore(schoolId);
        const results = sourceData.filter(record =>
            (!searchName || record.studentName.toLowerCase().includes(searchName.toLowerCase())) &&
            (!searchDob || record.studentDob === searchDob)
        );
        setSearchResults(results);
        setRecords(results);
        if (results.length === 0) {
            toast({ title: "No Results", description: "No records matched your current search criteria.", variant: "default" });
        } else {
            toast({ title: "Search Applied", description: `Found ${results.length} record(s).` });
        }
    } catch (err) {
        toast({ variant: 'destructive', title: "Search Error", description: "Failed to fetch and filter records." });
    } finally {
        setIsSearching(false);
    }
  }, [searchName, searchDob, schoolId, toast]);

  const loadRecords = useCallback(async () => {
    if (!schoolId) {
        if (isFirebaseConfigured) return; 
        else {
            setIsLoading(false);
            setFetchError("Firebase is not configured. Displaying mock data.");
            setRecords([]);
            return;
        }
    }
    
    setIsLoading(true);
    setFetchError(null);
    try {
      const fetchedRecords = await fetchCounsellingRecordsFromFirestore(schoolId);
      setRecords(fetchedRecords);
      setSearchResults(fetchedRecords); // Initially show all
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unknown error occurred.";
      setFetchError(msg);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    if (schoolId !== null) {
      loadRecords();
    }
  }, [schoolId, loadRecords]);
  
  useEffect(() => {
    if (editingRecordId && isFormModalOpen) {
      const recordToEdit = records.find(r => r.id === editingRecordId);
      if (recordToEdit) {
        const { id, userId, createdAt, updatedAt, schoolId, ...formData } = recordToEdit;
        reset(formData); 
        if (id) setDisplayRecordId(id);
      }
    }
  }, [editingRecordId, isFormModalOpen, reset, records]);


  const handleFormSubmitHandler: SubmitHandler<CounsellingRecordFormData> = async (data) => {
    if (!isFirebaseConfigured) {
        toast({ variant: "destructive", title: "Action Disabled", description: "Cannot save record because Firebase is not configured." });
        return;
    }
    
    if (!schoolId) {
        toast({ variant: "destructive", title: "Save Failed", description: "School ID not found. Cannot save record." });
        return;
    }

    const recordToSaveBase = {
        ...data,
        schoolId: schoolId,
    };

    try {
        await saveCounsellingRecordToFirestore(recordToSaveBase, editingRecordId ?? undefined);
        await loadRecords(); // Reload all records from Firestore
        
        toast({ title: editingRecordId ? "Record Updated" : "Record Saved", description: `Counselling record for ${data.studentName} has been processed.` });
        
        setIsFormModalOpen(false);
        reset();
    } catch (error) {
        console.error("Error saving record to Firestore:", error);
        toast({ variant: "destructive", title: "Save Failed", description: "Could not save counselling record." });
    }
  };
  
  const openAddModal = () => {
    setEditingRecordId(null);
    const tempId = `NEW-${Date.now()}`;
    setDisplayRecordId(tempId);
    reset(); 
    setIsFormModalOpen(true);
  };

  const openEditModal = (recordId: string) => {
    setEditingRecordId(recordId);
    setIsFormModalOpen(true); 
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!window.confirm("Are you sure you want to delete this counselling record?")) return;
    
    if (!isFirebaseConfigured) {
        toast({ variant: "destructive", title: "Action Disabled", description: "Cannot delete record because Firebase is not configured." });
        return;
    }

    try {
        await deleteCounsellingRecordFromFirestore(recordId);
        await loadRecords(); // Reload to reflect deletion
        toast({ title: "Record Deleted", description: "The counselling record has been deleted." });
    } catch (error) {
        console.error("Error deleting record from Firestore:", error);
        toast({ variant: "destructive", title: "Delete Failed", description: "Could not delete record."});
    }
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSearchDob('');
    setHasSearched(false);
    loadRecords();
    toast({ title: "Search Cleared", description: "Displaying all records." });
  };
  
  const handlePrint = () => {
    toast({ title: "Printing...", description: "Use your browser's print dialog to save as PDF or print." });
    window.print();
  };

  const handleSaveDraft = () => {
    const formData = getValues();
    console.log("Saving draft (simulated):", { id: displayRecordId, ...formData });
    toast({
      title: "Draft Saved",
      description: "Your counselling record draft has been saved (simulated).",
    });
  };

  const handleEmailForm = () => {
    toast({
      title: "Emailing Record (Simulated)",
      description: "An email would be sent to the relevant parties.",
    });
  };
  
  const displayedRecords = useMemo(() => {
    return hasSearched ? searchResults : records;
  }, [hasSearched, searchResults, records]);

  const yearOptions = useMemo(() => generateYearOptions(), []);

  return (
      <div className="flex flex-col gap-8">
        <PageHeader 
            title="Counselling Records"
            description="Manage confidential student counselling records."
        >
            <Button onClick={openAddModal}>
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Record
            </Button>
        </PageHeader>
        
        {!isFirebaseConfigured && (
            <Card className="bg-amber-50 border-amber-300">
                <CardHeader>
                    <CardTitle className="font-headline text-amber-800 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" /> Simulation Mode Active
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-amber-700">
                        The connection to the live Firebase database is not configured. This page is currently in read-only mode and displaying no data.
                        To connect to your database, please fill in your project credentials in the <code className="font-mono bg-amber-200/50 px-1 py-0.5 rounded">.env</code> file.
                    </p>
                </CardContent>
            </Card>
        )}

        <Dialog open={isFormModalOpen} onOpenChange={(isOpen) => {
            setIsFormModalOpen(isOpen);
            if (!isOpen) { 
                setEditingRecordId(null);
                reset();
                setDisplayRecordId('');
            }
          }}>
            <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-headline">{editingRecordId ? 'Edit Counselling Record' : 'New Record Entry'}</DialogTitle>
              </DialogHeader>
              <div className="printable-area">
                <form id="counselling-form" onSubmit={handleSubmit(handleFormSubmitHandler)} className="space-y-3 font-body max-h-[70vh] overflow-y-auto p-1 pr-3">
                  <div>
                    <Label htmlFor="record-id">Record ID</Label>
                    <Input id="record-id" value={displayRecordId} readOnly disabled className="bg-muted/50 cursor-not-allowed" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="session-date">Date of Session</Label>
                      <Input type="date" id="session-date" {...register("sessionDate")} />
                      {errors.sessionDate && <p className="text-destructive text-xs mt-1">{errors.sessionDate.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="counsellor-name">Counsellor Name</Label>
                      <Input type="text" id="counsellor-name" {...register("counsellorName")} placeholder="Full Name" />
                      {errors.counsellorName && <p className="text-destructive text-xs mt-1">{errors.counsellorName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="student-name">Student Name</Label>
                      <Input type="text" id="student-name" {...register("studentName")} placeholder="Full Name" />
                      {errors.studentName && <p className="text-destructive text-xs mt-1">{errors.studentName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="student-id">Student ID</Label>
                      <Input type="text" id="student-id" {...register("studentId")} placeholder="e.g., S12345" />
                      {errors.studentId && <p className="text-destructive text-xs mt-1">{errors.studentId.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="student-dob">Date of Birth</Label>
                      <Input type="date" id="student-dob" {...register("studentDob")} />
                      {errors.studentDob && <p className="text-destructive text-xs mt-1">{errors.studentDob.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="student-year">Year Level</Label>
                      <Controller
                          name="studentYear"
                          control={control}
                          render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger id="student-year"><SelectValue placeholder="Select year level" /></SelectTrigger>
                                  <SelectContent>
                                      {yearOptions.map(year => <SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          )}
                      />
                      {errors.studentYear && <p className="text-destructive text-xs mt-1">{errors.studentYear.message}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="counselling-type">Type of Counselling</Label>
                    <Controller
                        name="counsellingType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="counselling-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                                <SelectContent>
                                    {counsellingTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.counsellingType && <p className="text-destructive text-xs mt-1">{errors.counsellingType.message}</p>}
                  </div>

                  {showOtherCounsellingType && (
                    <div>
                      <Label htmlFor="other-counselling-type">Other Counselling Type</Label>
                      <Input type="text" id="other-counselling-type" {...register("otherCounsellingType")} placeholder="Describe other type" />
                      {errors.otherCounsellingType && <p className="text-destructive text-xs mt-1">{errors.otherCounsellingType.message}</p>}
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="session-details">Session Details</Label>
                    <Textarea id="session-details" {...register("sessionDetails")} placeholder="Detailed description of the session..." rows={3} />
                    {errors.sessionDetails && <p className="text-destructive text-xs mt-1">{errors.sessionDetails.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="parents-contacted">Parents Contacted</Label>
                      <Controller
                          name="parentsContacted"
                          control={control}
                          render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger id="parents-contacted"><SelectValue placeholder="Select status" /></SelectTrigger>
                                  <SelectContent>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
                                  <SelectItem value="Attempted">Attempted, No Response</SelectItem>
                                  <SelectItem value="Not Required">Not Required</SelectItem>
                                  </SelectContent>
                              </Select>
                          )}
                      />
                      {errors.parentsContacted && <p className="text-destructive text-xs mt-1">{errors.parentsContacted.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="action-plan">Action Plan / Follow-up</Label>
                    <Textarea id="action-plan" {...register("actionPlan")} placeholder="Describe action plan and next steps..." rows={3} />
                    {errors.actionPlan && <p className="text-destructive text-xs mt-1">{errors.actionPlan.message}</p>}
                  </div>
                </form>
              </div>
              <DialogFooter className="pt-3 print:hidden flex-wrap justify-center sm:justify-end gap-2">
                <Button type="button" variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Print Form
                </Button>
                <Button type="button" variant="outline" onClick={handleEmailForm}>
                    <Mail className="mr-2 h-4 w-4" /> Email Form
                </Button>
                <Button type="button" variant="secondary" onClick={handleSaveDraft} disabled={isFormSubmitting}>
                    <Save className="mr-2 h-4 w-4" /> Save Draft
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" form="counselling-form" disabled={isFormSubmitting}>
                  {isFormSubmitting ? (editingRecordId ? 'Updating...' : 'Saving...') : (editingRecordId ? 'Update Record' : 'Save Record')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card id="search-section" className="my-8 p-4 print:hidden">
            <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center"><SearchIcon className="mr-2 h-6 w-6"/>Search Records</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearchRecords} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <Label htmlFor="search-name">Student Name</Label>
                    <Input type="text" id="search-name" value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="Enter full or partial name" />
                    </div>
                    <div>
                    <Label htmlFor="search-dob">Date of Birth</Label>
                    <Input type="date" id="search-dob" value={searchDob} onChange={e => setSearchDob(e.target.value)} />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" className="w-full" disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleClearSearch} className="w-full" disabled={!hasSearched || isSearching}>
                    Clear Search
                    </Button>
                </div>
                </form>
            </CardContent>
          </Card>
          
          {isLoading && (
             <div className="space-y-2 my-8 print:hidden">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
          )}

          {!isLoading && fetchError && isFirebaseConfigured && (
            <Card className="mt-6 bg-destructive/10 border-destructive print:hidden">
                <CardHeader><CardTitle className="text-base text-destructive flex items-center"><AlertCircle className="mr-2 h-5 w-5" /> Error Loading Data</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-destructive">{fetchError}</p></CardContent>
            </Card>
          )}

          <div className="printable-area">
            {!isLoading && displayedRecords.length > 0 && (
                <Card id="preview-section" className="p-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">{hasSearched ? `Search Results (${displayedRecords.length})` : `All Counselling Records (${displayedRecords.length})`}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="print:hidden">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedRecords.map(record => (
                            <TableRow key={record.id}>
                                <TableCell>{record.sessionDate}</TableCell>
                                <TableCell>{record.studentName}</TableCell>
                                <TableCell>{record.studentId}</TableCell>
                                <TableCell>{record.studentYear}</TableCell>
                                <TableCell>{record.counsellingType === 'Other' ? record.otherCounsellingType : record.counsellingType}</TableCell>
                                <TableCell className="space-x-1 print:hidden">
                                <Button variant="ghost" size="icon" onClick={() => record.id && openEditModal(record.id)} title="Edit Record">
                                    <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => record.id && handleDeleteRecord(record.id)} title="Delete Record">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                    <Button onClick={handlePrint} className="w-full sm:w-auto mt-6 print:hidden">
                        <Printer className="mr-2 h-5 w-5" /> Print {hasSearched ? 'Results' : 'Records'}
                    </Button>
                </CardContent>
                </Card>
            )}
           {!isLoading && !fetchError && displayedRecords.length === 0 && (
             <Card className="mt-6 bg-muted/30 print:hidden">
                <CardHeader><CardTitle className="text-base flex items-center"><AlertCircle className="mr-2 h-5 w-5" />{hasSearched ? 'No Results Found' : 'No Counselling Records'}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-foreground">{hasSearched ? 'No counselling records matched your search criteria from the available data.' : 'No counselling records found for this school. Add a new record to get started.'}</p></CardContent>
            </Card>
           )}
          </div>
      </div>
  );
}
