"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, AlertCircle, HeartPulse, Printer } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';


interface InspectionItem {
  id: string; // Add an ID for React keys and potential database interaction
  day: string;
  item: string;
  childrenConcerned: string;
  actionTaken: string;
}

// Default structure for a new/empty inspection form, if not fetched
const defaultInspectionStructure: InspectionItem[] = [
  { id: "mon_uniform", day: "MONDAY", item: "UNIFORM/ FOOTWEAR/ HANDKERCHIEF", childrenConcerned: "", actionTaken: "" },
  { id: "tue_fingernails", day: "TUESDAY", item: "FINGERNAILS", childrenConcerned: "", actionTaken: "" },
  { id: "tue_toenails", day: "TUESDAY", item: "TOE NAILS", childrenConcerned: "", actionTaken: "" },
  { id: "wed_cuts", day: "WEDNESDAY", item: "CUTS AND SORES", childrenConcerned: "", actionTaken: "" },
  { id: "thu_hair", day: "THURSDAY", item: "HAIR-NITS & LICE/ RIBBON/ STYLE", childrenConcerned: "", actionTaken: "" },
  { id: "fri_dental", day: "FRIDAY", item: "DENTAL HYGIENE", childrenConcerned: "", actionTaken: "" },
];

// This function would ideally fetch the current week's inspection data or a template.
// For now, it will return the default structure or an empty array.
async function fetchHealthInspectionData(term: string, week: string, year: string, schoolId?: string): Promise<InspectionItem[]> {
  console.log("Simulating fetch health inspection data...", { term, week, year, schoolId });
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  // In a real app, you'd fetch based on term, week, year, and schoolId.
  // If no record exists, you might return the defaultInspectionStructure.
  // For this simulation, we'll assume if specific data isn't found, we start with the template.
  // To truly show an "empty" state, return [].
  return JSON.parse(JSON.stringify(defaultInspectionStructure)); // Return a copy
}

async function saveHealthInspectionToBackend(data: {
  term: string; week: string; year: string; inspectionItems: InspectionItem[];
  remarks: string; signature: string; date: string; schoolId?: string; userId: string;
}): Promise<{success: boolean}> {
  console.log("Simulating save health inspection to backend:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}


export function HealthSafetyClient() {
  const { toast } = useToast();
  const [term, setTerm] = useState('');
  const [week, setWeek] = useState('');
  const [year, setYear] = useState('');
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
  const [remarks, setRemarks] = useState('');
  const [signature, setSignature] = useState('');
  const [date, setDate] = useState(''); // Submission date of the form
  
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Placeholder for logged-in user ID

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSchoolId(localStorage.getItem('schoolId'));
      // Simulate getting logged-in user ID
      setUserId(localStorage.getItem('userId') || "currentUserPlaceholderId"); 
    }
  }, []);

  // Effect to load data when term, week, or year changes (or on initial load if they are set)
  useEffect(() => {
    const loadInspectionData = async () => {
      // If you want to load the default template immediately:
      setInspectionItems(JSON.parse(JSON.stringify(defaultInspectionStructure)));
      setIsLoading(false);
      
      // Only load if term, week, and year are defined.
      if (!term || !week || !year) {
        return;
      }
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await fetchHealthInspectionData(term, week, year, schoolId || undefined);
        setInspectionItems(data.length > 0 ? data : JSON.parse(JSON.stringify(defaultInspectionStructure)));
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Failed to load inspection data.");
        setInspectionItems(JSON.parse(JSON.stringify(defaultInspectionStructure))); // Fallback to default
      } finally {
        setIsLoading(false);
      }
    };

    loadInspectionData();
  }, [term, week, year, schoolId]);


  const handleItemChange = (index: number, field: keyof InspectionItem, value: string) => {
    const updatedItems = [...inspectionItems];
    if (updatedItems[index]) {
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setInspectionItems(updatedItems);
    } else {
        console.warn(`Attempted to update non-existent item at index ${index}`);
    }
  };

  const handlePrint = () => {
    toast({ title: "Printing...", description: "Use browser print dialog." });
    window.print();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!term || !week || !year || !signature || !date || !userId) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please fill all required header fields (Term, Week, Year, Signature, Date)."});
      return;
    }
    setIsSubmitting(true);
    
    try {
        await saveHealthInspectionToBackend({
          term, week, year, inspectionItems, remarks, signature, date,
          schoolId: schoolId || undefined,
          userId: userId,
        });
        toast({ title: "Health Inspection Saved", description: "Data has been successfully submitted (simulated)." });
    } catch (error) {
        toast({ variant: "destructive", title: "Submission Failed", description: "Could not save health inspection data." });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
      <div className="printable-area">
        <Card className="shadow-xl rounded-lg w-full max-w-4xl mx-auto">
          <CardHeader className="border-b pb-4">
            <div className="text-center mb-4">
              <HeartPulse className="mx-auto h-10 w-10 text-primary mb-2" />
              <p className="text-sm font-body text-muted-foreground">School Health Program</p>
              <CardTitle className="text-2xl font-headline text-primary">HEALTH INSPECTION</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="term" className="font-body font-semibold">TERM</Label>
                  <Input id="term" value={term} onChange={(e) => setTerm(e.target.value)} className="font-body" placeholder="e.g., 1" required/>
                </div>
                <div>
                  <Label htmlFor="week" className="font-body font-semibold">WEEK</Label>
                  <Input id="week" value={week} onChange={(e) => setWeek(e.target.value)} className="font-body" placeholder="e.g., 5" required/>
                </div>
                <div>
                  <Label htmlFor="year" className="font-body font-semibold">Year</Label>
                  <Input id="year" type="text" value={year} onChange={(e) => setYear(e.target.value)} className="font-body" placeholder="e.g., 2024" required/>
                </div>
              </div>

              {isLoading && (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              )}
              {!isLoading && fetchError && (
                  <Card className="bg-destructive/10 border-destructive">
                      <CardHeader>
                          <CardTitle className="font-headline text-base text-destructive flex items-center">
                              <AlertCircle className="mr-2 h-5 w-5" /> Error Loading Template
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="font-body text-sm text-destructive">{fetchError}</p>
                          <p className="font-body text-sm text-destructive-foreground/80 mt-1">Displaying default template.</p>
                      </CardContent>
                  </Card>
              )}

              {!isLoading && inspectionItems.length > 0 && (
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-body font-bold text-primary w-[15%]">DAYS</TableHead>
                        <TableHead className="font-body font-bold text-primary w-[25%]">ITEM</TableHead>
                        <TableHead className="font-body font-bold text-primary w-[30%]">CHILDREN CONCERNED</TableHead>
                        <TableHead className="font-body font-bold text-primary w-[30%]">ACTION TAKEN</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inspectionItems.map((entry, index) => (
                        <TableRow key={entry.id || index}> 
                          { (index === 0 || (index > 0 && inspectionItems[index-1].day !== entry.day))
                            ? <TableCell 
                                className="font-body align-top"
                                rowSpan={inspectionItems.filter(it => it.day === entry.day).length}
                              >
                                {entry.day}
                              </TableCell>
                            : null
                          }
                          <TableCell className="font-body align-top">{entry.item}</TableCell>
                          <TableCell className="font-body align-top p-1">
                            <Textarea
                              value={entry.childrenConcerned}
                              onChange={(e) => handleItemChange(index, 'childrenConcerned', e.target.value)}
                              className="min-h-[60px] font-body text-sm"
                              rows={2}
                            />
                          </TableCell>
                          <TableCell className="font-body align-top p-1">
                            <Textarea
                              value={entry.actionTaken}
                              onChange={(e) => handleItemChange(index, 'actionTaken', e.target.value)}
                              className="min-h-[60px] font-body text-sm"
                              rows={2}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {!isLoading && !fetchError && inspectionItems.length === 0 && (
                  <Card className="bg-muted/30 py-6">
                      <CardContent className="text-center">
                          <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                          <p className="font-body text-sm text-foreground">No inspection items to display. Please select Term, Week, and Year to load or start a new record.</p>
                      </CardContent>
                  </Card>
              )}


              <div className="space-y-2">
                <Label htmlFor="remarks" className="font-body font-semibold">REMARKS:</Label>
                <Textarea id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="min-h-[100px] font-body" rows={3} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-4">
                <div>
                  <Label htmlFor="signature" className="font-body font-semibold">SIGNATURE (Your Name):</Label>
                  <Input id="signature" value={signature} onChange={(e) => setSignature(e.target.value)} className="font-body" required/>
                </div>
                <div>
                  <Label htmlFor="date" className="font-body font-semibold">DATE (Submission):</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="font-body" required/>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 print:hidden">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrint}
                    disabled={isSubmitting || isLoading}
                >
                    <Printer className="mr-2 h-5 w-5" />
                    Print / Save PDF
                </Button>
                <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting || isLoading}
                >
                <Save className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Saving...' : 'Save Inspection'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
