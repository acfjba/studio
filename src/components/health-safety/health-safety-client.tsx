
"use client";

import React, { useState, type FormEvent, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, Printer, Mail, Save, Search as SearchIcon, AlertCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, getDocs, addDoc, serverTimestamp, Timestamp, query, where } from 'firebase/firestore';

interface OhsRecord {
  id: string;
  incidentDate: string;
  reportedBy: string;
  compiledBy: string;
  notifiedTo: string[];
  ambulanceCalled: boolean;
  headReport: string;
  actionTaken: string;
  parentsNotified: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

// --- Firestore Actions ---
async function fetchOhsRecordsFromFirestore(schoolId: string): Promise<OhsRecord[]> {
    if (!db) throw new Error("Firestore is not configured.");
    let q = query(collection(db, 'ohs'), where("schoolId", "==", schoolId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        } as OhsRecord;
    });
}

async function saveOhsRecordToFirestore(record: Omit<OhsRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<OhsRecord> {
    if (!db) throw new Error("Firestore is not configured.");
    const collectionRef = collection(db, 'ohs');
    const dataToAdd = { ...record, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    const docRef = await addDoc(collectionRef, dataToAdd);
    return { ...record, id: docRef.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

export function HealthInspectionClient() {
  const { toast } = useToast();
  const [schoolId, setSchoolId] = useState<string | null>(null);

  // Form state
  const [incidentDate, setIncidentDate] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [compiledBy, setCompiledBy] = useState('');
  const [notifiedTo, setNotifiedTo] = useState<string[]>([]);
  const [ambulanceCalled, setAmbulanceCalled] = useState(false);
  const [headReport, setHeadReport] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [parentsNotified, setParentsNotified] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search/view state
  const [searchDate, setSearchDate] = useState('');
  const [searchReportedBy, setSearchReportedBy] = useState('');
  const [searchParentsNotified, setSearchParentsNotified] = useState('');
  const [searchResults, setSearchResults] = useState<OhsRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const loadAllRecords = useCallback(async () => {
    if (!schoolId) {
        if(isFirebaseConfigured) return;
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setHasSearched(false);
    try {
        const records = await fetchOhsRecordsFromFirestore(schoolId);
        setSearchResults(records);
    } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: "Error", description: "Failed to load OHS records." });
    } finally {
        setIsLoading(false);
    }
  }, [schoolId, toast]);

  useEffect(() => {
      if (schoolId !== null) {
        loadAllRecords();
      }
  }, [schoolId, loadAllRecords]);

  const handleNotifiedToChange = (value: string, checked: boolean) => {
    setNotifiedTo(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const resetForm = () => {
    setIncidentDate('');
    setReportedBy('');
    setCompiledBy('');
    setNotifiedTo([]);
    setAmbulanceCalled(false);
    setHeadReport('');
    setActionTaken('');
    setParentsNotified('');
  };

  const handleSaveRecord = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!isFirebaseConfigured) {
        toast({ variant: "destructive", title: "Action Disabled", description: "Cannot save record because Firebase is not configured." });
        return;
    }
     if (!schoolId) {
        toast({ variant: "destructive", title: "Action Disabled", description: "School ID not found. Cannot save record." });
        return;
    }
    setIsSubmitting(true);
    const newRecord: Omit<OhsRecord, 'id' | 'createdAt' | 'updatedAt'> = {
      incidentDate, reportedBy, compiledBy, notifiedTo,
      ambulanceCalled, headReport, actionTaken, parentsNotified,
      schoolId,
    };
    try {
        await saveOhsRecordToFirestore(newRecord);
        toast({ title: "Record Saved", description: "OHS incident record has been saved to Firestore." });
        resetForm();
        await loadAllRecords(); // Refresh the list
    } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: "Error", description: "Failed to save OHS record." });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleSearchRecords = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!schoolId) return;
    setHasSearched(true);
    setIsLoading(true);
    
    try {
        if (!isFirebaseConfigured) throw new Error("Firebase not configured");
        const allRecords = await fetchOhsRecordsFromFirestore(schoolId);
        const filtered = allRecords.filter(record => 
            (!searchDate || record.incidentDate === searchDate) &&
            (!searchReportedBy || record.reportedBy.toLowerCase().includes(searchReportedBy.toLowerCase())) &&
            (!searchParentsNotified || record.parentsNotified === searchParentsNotified)
        );
        setSearchResults(filtered);
        if (filtered.length === 0) {
             toast({ title: "No Results", description: "No records matched your search." });
        }
    } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: "Search Error", description: "Failed to search records." });
    } finally {
        setIsLoading(false);
    }
  };

  const handlePrint = () => {
    toast({
      title: "Printing...",
      description: "Use your browser's print dialog to save as PDF or print.",
    });
    window.print();
  };

  const handleEmailRecord = async () => {
    setIsSubmitting(true);
    const currentRecord = {
      incidentDate, reportedBy, compiledBy, notifiedTo,
      ambulanceCalled, headReport, actionTaken, parentsNotified,
    };
    if (!incidentDate || !reportedBy) {
         toast({ variant: "destructive", title: "Missing Data", description: "Please fill at least 'Date of Incident' and 'Reported By' to email a record." });
         setIsSubmitting(false);
         return;
    }
    console.log("Emailing OHS record:", currentRecord);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    toast({ title: "Email Sent (Simulated)", description: "Email sent from headteacher@example.com to ministry@example.com." });
    setIsSubmitting(false);
  };
  
  const notifiedOptions = ["Ministry of Education", "Ministry of Health", "Police"];
  const specialAnyStatusValue = "_ANY_STATUS_";

  return (
      <div className="space-y-8">
         {!isFirebaseConfigured && (
            <Card className="bg-amber-50 border-amber-300">
                <CardHeader>
                    <CardTitle className="font-headline text-amber-800 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" /> Simulation Mode Active
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-amber-700">
                        The connection to the live Firebase database is not configured. No data can be saved or loaded.
                    </p>
                </CardContent>
            </Card>
        )}
        <div className="printable-area">
          <section id="entry-form" className="p-4 border border-border rounded-lg shadow-md bg-card">
              <CardHeader className="p-2">
                  <CardTitle className="text-2xl font-headline text-primary mb-4">New OHS Record</CardTitle>
              </CardHeader>
              <CardContent>
              <form onSubmit={handleSaveRecord} className="space-y-4 font-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                  <Label htmlFor="ohs-date">Date of Incident</Label>
                  <Input type="date" id="ohs-date" value={incidentDate} onChange={e => setIncidentDate(e.target.value)} required />
                  </div>
                  <div>
                  <Label htmlFor="ohs-reported-by">Reported By</Label>
                  <Input type="text" id="ohs-reported-by" value={reportedBy} onChange={e => setReportedBy(e.target.value)} placeholder="Name of reporter" required />
                  </div>
                  <div>
                  <Label htmlFor="ohs-compiled-by">Compiled By</Label>
                  <Input type="text" id="ohs-compiled-by" value={compiledBy} onChange={e => setCompiledBy(e.target.value)} placeholder="Name of compiler" required />
                  </div>
                  <div>
                  <Label htmlFor="ohs-parents-notified">Parents Notified</Label>
                  <Select value={parentsNotified} onValueChange={setParentsNotified} required>
                      <SelectTrigger id="ohs-parents-notified"><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Attempted">Attempted, No Response</SelectItem>
                      </SelectContent>
                  </Select>
                  </div>
              </div>

              <div>
                  <Label className="mb-2 block">Notified To</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                  {notifiedOptions.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                          id={`notified-${option.toLowerCase().replace(/\s+/g, '-')}`}
                          checked={notifiedTo.includes(option)}
                          onCheckedChange={(checked) => handleNotifiedToChange(option, !!checked)}
                      />
                      <Label htmlFor={`notified-${option.toLowerCase().replace(/\s+/g, '-')}`} className="font-normal">{option}</Label>
                      </div>
                  ))}
                  </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="ohs-ambulance-called" checked={ambulanceCalled} onCheckedChange={(checked) => setAmbulanceCalled(!!checked)} />
                  <Label htmlFor="ohs-ambulance-called" className="font-normal">Ambulance Called?</Label>
              </div>

              <div>
                  <Label htmlFor="ohs-head-report">Head Report / Incident Details</Label>
                  <Textarea id="ohs-head-report" value={headReport} onChange={e => setHeadReport(e.target.value)} placeholder="Detailed description of the incident" rows={3} />
              </div>
              <div>
                  <Label htmlFor="ohs-action-taken">Action Taken / Next Steps</Label>
                  <Textarea id="ohs-action-taken" value={actionTaken} onChange={e => setActionTaken(e.target.value)} placeholder="Describe actions taken and any next steps" rows={3} />
              </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                      <Save className="mr-2 h-5 w-5" />
                      {isSubmitting ? 'Saving...' : 'Save Record'}
                  </Button>
              </form>
              </CardContent>
          </section>
        </div>

        <section id="search-section" className="p-4 border border-border rounded-lg shadow-md bg-card print:hidden">
            <CardHeader className="p-2">
                <CardTitle className="text-2xl font-headline text-primary mb-4 flex items-center"><SearchIcon className="mr-2 h-6 w-6"/>Search OHS Records</CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSearchRecords} className="space-y-4 font-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <Label htmlFor="search-date">Date of Incident</Label>
                <Input type="date" id="search-date" value={searchDate} onChange={e => setSearchDate(e.target.value)} />
                </div>
                <div>
                <Label htmlFor="search-issued-by">Reported By</Label>
                <Input type="text" id="search-issued-by" value={searchReportedBy} onChange={e => setSearchReportedBy(e.target.value)} placeholder="Enter name" />
                </div>
                <div>
                <Label htmlFor="search-parents">Parents Notified</Label>
                <Select 
                    value={searchParentsNotified === "" ? specialAnyStatusValue : searchParentsNotified} 
                    onValueChange={(value) => setSearchParentsNotified(value === specialAnyStatusValue ? "" : value)}
                >
                    <SelectTrigger id="search-parents"><SelectValue placeholder="Any status" /></SelectTrigger>
                    <SelectContent>
                    <SelectItem value={specialAnyStatusValue}>Any Status</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Attempted">Attempted, No Response</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                <SearchIcon className="mr-2 h-5 w-5" />
                {isLoading && hasSearched ? 'Searching...' : 'Search Records'}
            </Button>
            </form>
            </CardContent>
        </section>

        <div className="printable-area">
          <section id="preview-section" className="p-4 border border-border rounded-lg shadow-md bg-card">
              <CardHeader className="p-2">
                  <CardTitle className="text-2xl font-headline text-primary mb-4">{hasSearched ? "Search Results" : "All Records"}</CardTitle>
              </CardHeader>
              <CardContent>
                  {isLoading ? (
                      <div className="space-y-2"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>
                  ) : searchResults.length > 0 ? (
                      <div className="overflow-x-auto">
                      <Table>
                          <TableHeader>
                          <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Reported By</TableHead>
                              <TableHead>Compiled By</TableHead>
                              <TableHead>Notified To</TableHead>
                              <TableHead>Ambulance</TableHead>
                              <TableHead>Head Report</TableHead>
                              <TableHead>Action Taken</TableHead>
                              <TableHead>Parents</TableHead>
                          </TableRow>
                          </TableHeader>
                          <TableBody className="font-body">
                          {searchResults.map(record => (
                              <TableRow key={record.id}>
                              <TableCell>{record.incidentDate}</TableCell>
                              <TableCell>{record.reportedBy}</TableCell>
                              <TableCell>{record.compiledBy}</TableCell>
                              <TableCell>{record.notifiedTo.join(', ')}</TableCell>
                              <TableCell>{record.ambulanceCalled ? 'Yes' : 'No'}</TableCell>
                              <TableCell className="max-w-xs truncate">{record.headReport}</TableCell>
                              <TableCell className="max-w-xs truncate">{record.actionTaken}</TableCell>
                              <TableCell>{record.parentsNotified}</TableCell>
                              </TableRow>
                          ))}
                          </TableBody>
                      </Table>
                      </div>
                  ) : (
                      <Card className="mt-6 bg-muted/30">
                          <CardHeader>
                              <CardTitle className="font-headline text-base text-primary flex items-center">
                                  <AlertCircle className="mr-2 h-5 w-5" />
                                  No Results Found
                              </CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="font-body text-sm text-foreground">
                                  {hasSearched ? "No OHS records matched your search criteria." : "No OHS records have been logged yet."}
                              </p>
                          </CardContent>
                      </Card>
                  )}
              </CardContent>
          </section>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 print:hidden">
            <Button onClick={handlePrint} className="w-full sm:w-auto" variant="outline">
                <Printer className="mr-2 h-5 w-5" /> Print
            </Button>
            <Button onClick={handleEmailRecord} className="w-full sm:w-auto" disabled={isSubmitting}>
                <Mail className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Emailing...' : 'Email Record'}
            </Button>
        </div>
      </div>
  );
}
