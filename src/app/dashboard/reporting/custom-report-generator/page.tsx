
"use client";

import React, { useState, useMemo } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Download, Settings2, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

type ReportSection = {
    title: string;
    headers: string[];
    rows: (string | number)[][];
};

type ReportData = ReportSection[];

const dataSources = [
    { id: 'disciplinary', label: 'Disciplinary Records' },
    { id: 'counselling', label: 'Counselling Records' },
    { id: 'examResults', label: 'Exam Results' },
    { id: 'staff', label: 'Staff Records' },
    { id: 'ohs', label: 'OHS Incidents' },
];

// --- MOCK FETCH FUNCTION ---
// In a real app, this would fetch data from multiple Firestore collections based on selected sources and date range.
async function fetchCustomReportData(sources: string[], dateFrom: string, dateTo: string): Promise<ReportData> {
    console.log("Fetching custom report data for sources:", sources, "from", dateFrom, "to", dateTo);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const report: ReportData = [];

    if (sources.includes('disciplinary')) {
        report.push({
            title: 'Disciplinary Records',
            headers: ['Date', 'Student', 'Issue', 'Action Taken'],
            rows: [
                ['2024-05-12', 'Adi Litia', 'Absent', 'Verbal warning given.'],
                ['2024-05-14', 'Jone Doe', 'Bullying', 'Parents contacted. Suspension.'],
            ]
        });
    }
    if (sources.includes('examResults')) {
        report.push({
            title: 'Exam Results',
            headers: ['Date', 'Student', 'Subject', 'Score', 'Grade'],
            rows: [
                ['2024-06-01', 'Ratu Penaia', 'Mathematics', 88, 'A+'],
                ['2024-06-02', 'Sereana Vula', 'English', 75, 'A'],
            ]
        });
    }
    if (sources.includes('staff')) {
        report.push({
            title: 'Staff Records (Active)',
            headers: ['Name', 'Role', 'Email'],
            rows: [
                ['Dr. Evelyn Reed', 'Head Teacher', 'e.reed@suvagrammar.ac.fj'],
                ['Mr. Samuel Greene', 'Teacher', 's.greene@suvagrammar.ac.fj'],
            ]
        });
    }

    return report;
}


export default function CustomReportGeneratorPage() {
    const { toast } = useToast();
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState<ReportData | null>(null);

    const handleSourceChange = (sourceId: string, checked: boolean) => {
        setSelectedSources(prev => 
            checked ? [...prev, sourceId] : prev.filter(id => id !== sourceId)
        );
    };

    const handleGenerateReport = async () => {
        if (selectedSources.length === 0) {
            toast({ variant: 'destructive', title: 'Please select at least one data source.' });
            return;
        }
        setIsLoading(true);
        setReportData(null);
        try {
            const data = await fetchCustomReportData(selectedSources, dateFrom, dateTo);
            setReportData(data);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not generate report." });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        toast({ title: "Printing...", description: "Use your browser's print dialog to save as PDF or print." });
        window.print();
    };

    const handleExportCsv = () => {
        if (!reportData || reportData.length === 0) {
            toast({ variant: 'destructive', title: 'No data to export.' });
            return;
        }
    
        let csvContent = "data:text/csv;charset=utf-8,";
    
        reportData.forEach(section => {
            csvContent += `"${section.title}"\n`;
            csvContent += section.headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',') + '\n';
            csvContent += section.rows.map(row => 
                row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
            ).join('\n');
            csvContent += '\n\n'; // Add space between sections
        });
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `custom_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Export Successful", description: "Custom report has been downloaded as a CSV file." });
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Custom Report Generator"
                description="Select data sources and criteria to build a custom report."
            />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <Card className="lg:col-span-1 shadow-lg rounded-lg print:hidden">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center"><Settings2 className="mr-2 h-5 w-5" /> Report Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label className="font-semibold">Data Sources</Label>
                            <div className="space-y-2 mt-2 p-3 border rounded-md">
                                {dataSources.map(source => (
                                    <div key={source.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={source.id} 
                                            onCheckedChange={(checked) => handleSourceChange(source.id, !!checked)}
                                            checked={selectedSources.includes(source.id)}
                                        />
                                        <Label htmlFor={source.id} className="font-normal">{source.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label className="font-semibold">Date Range</Label>
                            <div className="grid grid-cols-1 gap-2 mt-2">
                                <div>
                                    <Label htmlFor="date-from" className="text-xs text-muted-foreground">From</Label>
                                    <Input id="date-from" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="date-to" className="text-xs text-muted-foreground">To</Label>
                                    <Input id="date-to" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={handleGenerateReport} className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isLoading ? 'Generating...' : 'Generate Report'}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="lg:col-span-3 printable-area">
                     <Card className="shadow-lg rounded-lg">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="font-headline">Generated Report</CardTitle>
                                    <CardDescription>Your custom-built report will appear below.</CardDescription>
                                </div>
                                <div className="flex gap-2 print:hidden">
                                    <Button onClick={handlePrint} variant="outline" disabled={!reportData}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                                    <Button onClick={handleExportCsv} disabled={!reportData}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="min-h-[400px]">
                            {isLoading && <Skeleton className="h-64 w-full" />}
                            {!isLoading && !reportData && (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg">
                                    <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mt-4 text-lg font-semibold text-muted-foreground">No Report Generated</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Select your options and click "Generate Report".</p>
                                </div>
                            )}
                            {!isLoading && reportData && reportData.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg">
                                    <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mt-4 text-lg font-semibold text-muted-foreground">No Data Found</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">No data was found for your selected criteria.</p>
                                </div>
                            )}
                            {!isLoading && reportData && reportData.length > 0 && (
                                <div className="space-y-8">
                                    {reportData.map((section, index) => (
                                        <div key={index}>
                                            <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                                            <div className="overflow-x-auto rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            {section.headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {section.rows.map((row, rIndex) => (
                                                            <TableRow key={rIndex}>
                                                                {row.map((cell, cIndex) => <TableCell key={cIndex}>{cell}</TableCell>)}
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            {index < reportData.length - 1 && <Separator className="mt-8" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

