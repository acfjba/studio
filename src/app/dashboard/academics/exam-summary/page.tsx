
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BookCopy, FileCheck2, ListOrdered, AlertCircle, AlertTriangle } from "lucide-react";
import type { ExamResult } from '@/lib/schemas/exam-results';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/layout/page-header';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';


// --- MOCK DATA for charts when no live data is available ---
const trialTestsData = [
  { name: 'Week 1', score: 65 }, { name: 'Week 2', score: 68 }, { name: 'Week 3', score: 72 },
  { name: 'Week 4', score: 71 }, { name: 'Week 5', score: 75 }, { name: 'Week 6', score: 78 },
];
const majorExamsData = [
  { name: 'Numeracy', 'Mid-Year': 72, 'Final Trial': 81 }, { name: 'Literacy', 'Mid-Year': 68, 'Final Trial': 75 },
  { name: 'General Science', 'Mid-Year': 75, 'Final Trial': 79 },
];
const lanaSummary = { literacyPassRate: 85.2, numeracyPassRate: 88.9, totalCandidates: 150 };

async function fetchAllExamResults(): Promise<ExamResult[]> {
  if (!db) throw new Error("Firestore is not configured.");
  const q = query(collection(db, 'examResults'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as ExamResult;
  });
}

export default function ExamSummaryPage() {
    const [detailedResults, setDetailedResults] = useState<ExamResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string|null>(null);
    const [termFilter, setTermFilter] = useState('All');
    const [academicYearFilter, setAcademicYearFilter] = useState('All');

    const loadData = useCallback(async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        if (!isFirebaseConfigured) {
          throw new Error("Firebase is not configured. Cannot load summary.");
        }
        const results = await fetchAllExamResults();
        setDetailedResults(results);
        if (results.length > 0) {
            const latestYear = Math.max(...results.map(r => parseInt(r.year, 10))).toString();
            setAcademicYearFilter(latestYear);
        }
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      loadData();
    }, [loadData]);


    const { uniqueTerms, uniqueAcademicYears, aggregatedClassData } = useMemo(() => {
        const terms = ['All', ...Array.from(new Set(detailedResults.map(r => r.term)))].sort();
        const academicYears = ['All', ...Array.from(new Set(detailedResults.map(r => r.year)))].sort().reverse();
        
        const filteredByTermAndYear = detailedResults.filter(result => {
            const termMatch = termFilter === 'All' || result.term === termFilter;
            const academicYearMatch = academicYearFilter === 'All' || result.year === academicYearFilter;
            return termMatch && academicYearMatch;
        });

        const studentYears = [...new Set(filteredByTermAndYear.map(r => r.studentYear))].sort((a,b) => parseInt(a, 10) - parseInt(b, 10));

        const aggregatedData = studentYears.map(year => {
            const yearResults = filteredByTermAndYear.filter(r => r.studentYear === year);
            const scores = yearResults.map(r => Number(r.score)).filter(s => !isNaN(s));
            
            if (scores.length === 0) return null;

            const averageScore = scores.reduce((acc, s) => acc + s, 0) / scores.length;
            const highestScore = Math.max(...scores);
            const lowestScore = Math.min(...scores);
            const PASS_MARK = 50;
            const passedCount = scores.filter(s => s >= PASS_MARK).length;
            const passRate = (passedCount / scores.length) * 100;

            return {
                yearLevel: `Year ${year}`,
                resultCount: scores.length,
                averageScore: averageScore.toFixed(1),
                passRate: passRate.toFixed(1) + '%',
                highestScore,
                lowestScore,
            };
        }).filter(Boolean) as any[];

        return { uniqueTerms, uniqueAcademicYears, aggregatedClassData };
    }, [detailedResults, termFilter, academicYearFilter]);

  return (
      <div className="flex flex-col gap-8">
        <PageHeader 
            title="Exam Results Summary & Reflections"
            description="An overview of school-wide academic performance based on recorded exam data."
        />
        
        {!isFirebaseConfigured && (
            <Card className="bg-amber-50 border-amber-300">
                <CardHeader>
                    <CardTitle className="font-headline text-amber-800 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" /> Simulation Mode Active
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-amber-700">
                        Firebase is not configured. Chart data is for demonstration only. The results board below will not load.
                    </p>
                </CardContent>
            </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg rounded-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center"><TrendingUp className="mr-2 h-6 w-6" />Weekly Trial Test Performance (Demo)</CardTitle>
              <CardDescription>Performance trend from weekly trial tests across all subjects.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%"><RechartsLineChart data={trialTestsData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis domain={[60, 90]} /><Tooltip /><Legend /><Line type="monotone" dataKey="score" name="Average Score" stroke="hsl(var(--primary))" strokeWidth={2} /></RechartsLineChart></ResponsiveContainer>
              </div>
              <div className="font-body text-foreground bg-muted/30 p-4 rounded-md"><h4 className="font-bold mb-2">Reflection:</h4><p className="text-sm mb-2">The data shows a consistent upward trend in weekly trial test scores over the past six weeks, indicating effective teaching strategies and student engagement. The slight dip in Week 4 corresponds with the school's sports day, suggesting a minor impact from extracurricular activities.</p><p className="text-sm font-semibold">Focus Area: Maintain this positive momentum and provide targeted support to students who are not following the trend.</p></div>
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center"><FileCheck2 className="mr-2 h-6 w-6" />Mid-Year vs. Final Trial (Demo)</CardTitle>
              <CardDescription>Comparison of average scores in key subjects.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%"><BarChart data={majorExamsData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="Mid-Year" fill="hsl(var(--chart-2))" /><Bar dataKey="Final Trial" fill="hsl(var(--chart-1))" /></BarChart></ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center"><BookCopy className="mr-2 h-6 w-6" />LANA Results Summary (Demo)</CardTitle>
              <CardDescription>Key metrics from the latest Literacy and Numeracy Assessment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-around text-center"><div><p className="text-3xl font-bold text-primary">{lanaSummary.literacyPassRate}%</p><p className="text-sm text-muted-foreground">Literacy Pass Rate</p></div><div><p className="text-3xl font-bold text-primary">{lanaSummary.numeracyPassRate}%</p><p className="text-sm text-muted-foreground">Numeracy Pass Rate</p></div></div>
              <div className="text-center bg-muted/30 p-3 rounded-md"><p className="text-lg font-semibold">{lanaSummary.totalCandidates}</p><p className="text-sm text-muted-foreground">Total Candidates Assessed</p></div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg rounded-lg">
            <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center"><ListOrdered className="mr-2 h-6 w-6" />School Final Results Board</CardTitle>
                <CardDescription>Aggregated performance for each year level based on live data. Pass Rate is based on a score of 50% or higher.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div>
                        <Label htmlFor="term-filter" className="text-sm font-medium">Term</Label>
                        <Select value={termFilter} onValueChange={setTermFilter} disabled={isLoading}><SelectTrigger id="term-filter" className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by Term" /></SelectTrigger><SelectContent>{uniqueTerms.map(term => <SelectItem key={term} value={term}>{term}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div>
                        <Label htmlFor="academic-year-filter" className="text-sm font-medium">Academic Year</Label>
                        <Select value={academicYearFilter} onValueChange={setAcademicYearFilter} disabled={isLoading}><SelectTrigger id="academic-year-filter" className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by Year" /></SelectTrigger><SelectContent>{uniqueAcademicYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent></Select>
                    </div>
                </div>

                {isLoading ? <Skeleton className="h-64 w-full" /> 
                  : fetchError ? <Card className="mt-6 bg-destructive/10"><CardHeader><CardTitle className="text-base text-destructive flex items-center"><AlertCircle className="mr-2 h-5 w-5" />Error</CardTitle></CardHeader><CardContent><p className="text-sm text-destructive">{fetchError}</p></CardContent></Card>
                  : aggregatedClassData.length === 0 ? (
                    <Card className="mt-6 bg-muted/30"><CardHeader><CardTitle className="font-headline text-base text-primary flex items-center"><AlertCircle className="mr-2 h-5 w-5" />No Results Found</CardTitle></CardHeader><CardContent><p className="font-body text-sm text-foreground">No exam results match your current filter criteria.</p></CardContent></Card>
                ) : (
                    <div className="overflow-x-auto rounded-md border max-h-[500px]">
                        <Table><TableHeader className="sticky top-0 bg-muted/95"><TableRow><TableHead>Year Level</TableHead><TableHead className="text-center">No. of Results</TableHead><TableHead className="text-center">Average Score</TableHead><TableHead className="text-center">Pass Rate</TableHead><TableHead className="text-center">Highest Score</TableHead><TableHead className="text-center">Lowest Score</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {aggregatedClassData.map(result => (
                                    <TableRow key={result.yearLevel}>
                                        <TableCell className="font-medium">{result.yearLevel}</TableCell><TableCell className="text-center">{result.resultCount}</TableCell><TableCell className="text-center font-semibold">{result.averageScore}</TableCell>
                                        <TableCell className="text-center"><Badge variant={parseFloat(result.passRate) >= 80 ? "default" : parseFloat(result.passRate) < 50 ? "destructive" : "secondary"} className={cn(parseFloat(result.passRate) >= 80 && 'bg-green-600 hover:bg-green-700')}>{result.passRate}</Badge></TableCell>
                                        <TableCell className="text-center text-green-700 font-bold">{result.highestScore}</TableCell><TableCell className="text-center text-destructive font-bold">{result.lowestScore}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
  );
}
