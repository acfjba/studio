
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Download, Filter, AlertCircle } from "lucide-react";
import { sampleExamResultsData } from '@/lib/data';
import type { ExamResult } from '@/lib/schemas/exam-results';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Simulate fetching data for the report
async function fetchAcademicReportData(): Promise<ExamResult[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return sampleExamResultsData;
}

export default function AcademicReportsPage() {
    const { toast } = useToast();
    const [examData, setExamData] = useState<ExamResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [yearFilter, setYearFilter] = useState<string>('all');
    const [examTypeFilter, setExamTypeFilter] = useState<string>('all');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchAcademicReportData();
                setExamData(data);
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Could not load academic data." });
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [toast]);
    
    const uniqueYears = useMemo(() => ['all', ...Array.from(new Set(examData.map(e => e.studentYear)))].sort(), [examData]);
    const uniqueExamTypes = useMemo(() => ['all', ...Array.from(new Set(examData.map(e => e.examType)))], [examData]);

    const filteredData = useMemo(() => {
        return examData.filter(exam => 
            (yearFilter === 'all' || exam.studentYear === yearFilter) &&
            (examTypeFilter === 'all' || exam.examType === examTypeFilter)
        );
    }, [examData, yearFilter, examTypeFilter]);

    const aggregatedReport = useMemo(() => {
        if (filteredData.length === 0) return null;

        const subjects = [...new Set(filteredData.map(d => d.subject))];
        return subjects.map(subject => {
            const subjectData = filteredData.filter(d => d.subject === subject);
            const scores = subjectData.map(d => Number(d.score)).filter(s => !isNaN(s));
            if (scores.length === 0) {
                return { subject, entries: subjectData.length, averageScore: 'N/A', passRate: 'N/A' };
            }
            const averageScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
            const passCount = scores.filter(s => s >= 50).length;
            const passRate = ((passCount / scores.length) * 100).toFixed(1) + '%';
            return { subject, entries: scores.length, averageScore, passRate };
        });
    }, [filteredData]);

    const handlePrint = () => {
        toast({ title: "Printing...", description: "Use your browser's print dialog to save as PDF or print." });
        window.print();
    };

    const handleExportCsv = () => {
        if (!aggregatedReport || aggregatedReport.length === 0) {
            toast({ variant: "destructive", title: "No Data", description: "There is no data to export." });
            return;
        }
        const headers = ["Subject", "Number of Entries", "Average Score", "Pass Rate"];
        const rows = aggregatedReport.map(row => [
            `"${row.subject.replace(/"/g, '""')}"`,
            row.entries,
            row.averageScore,
            `"${row.passRate}"`,
        ].join(','));
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `academic_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Export Successful", description: "Academic report has been downloaded as a CSV file." });
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Academic Reports"
                description="Generate and view reports on student performance and exam results."
            />
            <Card className="shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Academic Report Generator</CardTitle>
                    <CardDescription>Use the filters to generate a report on exam performance by subject.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border rounded-lg mb-6 bg-muted/50 print:hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="font-semibold text-lg flex items-center col-span-full md:col-span-1"><Filter className="mr-2 h-5 w-5" /> Filters</div>
                            <div>
                                <Label htmlFor="year-filter">Year Level</Label>
                                <Select value={yearFilter} onValueChange={setYearFilter}>
                                    <SelectTrigger id="year-filter"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {uniqueYears.map(year => <SelectItem key={year} value={year}>{year === 'all' ? 'All Years' : `Year ${year}`}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="exam-type-filter">Exam Type</Label>
                                <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
                                    <SelectTrigger id="exam-type-filter"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {uniqueExamTypes.map(type => <SelectItem key={type} value={type}>{type === 'all' ? 'All Types' : type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="printable-area">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Generated Report</h3>
                            <div className="flex gap-2 print:hidden">
                                <Button onClick={handlePrint} variant="outline"><Printer className="mr-2 h-4 w-4" /> Print</Button>
                                <Button onClick={handleExportCsv}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                            </div>
                        </div>

                        {isLoading ? (
                            <Skeleton className="h-64 w-full" />
                        ) : !aggregatedReport ? (
                            <Card className="mt-6 bg-muted/30">
                                <CardHeader><CardTitle className="font-headline text-base flex items-center"><AlertCircle className="mr-2 h-5 w-5" />No Data Found</CardTitle></CardHeader>
                                <CardContent><p className="text-sm text-foreground">No exam results match your current filter criteria.</p></CardContent>
                            </Card>
                        ) : (
                            <div className="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Subject</TableHead>
                                            <TableHead className="text-center">Entries</TableHead>
                                            <TableHead className="text-center">Average Score (%)</TableHead>
                                            <TableHead className="text-center">Pass Rate</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {aggregatedReport.map(row => (
                                            <TableRow key={row.subject}>
                                                <TableCell className="font-medium">{row.subject}</TableCell>
                                                <TableCell className="text-center">{row.entries}</TableCell>
                                                <TableCell className="text-center font-semibold">{row.averageScore}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={parseFloat(row.passRate) >= 80 ? 'default' : parseFloat(row.passRate) < 50 ? 'destructive' : 'secondary'} className={cn(parseFloat(row.passRate) >= 80 && 'bg-green-600 hover:bg-green-700')}>
                                                        {row.passRate}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
