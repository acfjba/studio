
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Download, Users, AlertCircle, Filter } from "lucide-react";
import { staffData as sampleStaffData, schoolData } from '@/lib/data';
import type { StaffMember } from '@/lib/schemas/staff';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Simulate fetching data for the report
async function fetchStaffReportData(): Promise<StaffMember[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return sampleStaffData;
}


export default function StaffReportsPage() {
    const { toast } = useToast();
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [schoolFilter, setSchoolFilter] = useState<string>('all');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchStaffReportData();
                setStaffList(data);
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Could not load staff data." });
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [toast]);
    
    const uniqueSchools = useMemo(() => ([{id: 'all', name: 'All Schools'}, ...schoolData]), []);
    const uniqueRoles = useMemo(() => ['all', ...Array.from(new Set(staffList.map(s => s.role)))], [staffList]);
    const uniqueStatuses = useMemo(() => ['all', ...Array.from(new Set(staffList.map(s => s.status)))], [staffList]);

    const filteredStaff = useMemo(() => {
        return staffList.filter(staff => 
            (schoolFilter === 'all' || staff.schoolId === schoolFilter) &&
            (roleFilter === 'all' || staff.role === roleFilter) &&
            (statusFilter === 'all' || staff.status === statusFilter)
        );
    }, [staffList, schoolFilter, roleFilter, statusFilter]);
    
    const statusVariants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
        'Active': 'default',
        'On Leave': 'secondary',
        'Terminated': 'destructive',
    };

    const handlePrint = () => {
        toast({ title: "Printing...", description: "Use your browser's print dialog to save as PDF or print." });
        window.print();
    };

    const handleExportCsv = () => {
        if (filteredStaff.length === 0) {
            toast({ variant: "destructive", title: "No Data", description: "There is no data to export." });
            return;
        }
        const headers = ["Staff ID", "Name", "Role", "Position", "Email", "Phone", "School ID", "Status"];
        const rows = filteredStaff.map(staff => [
            staff.staffId,
            `"${staff.name.replace(/"/g, '""')}"`,
            staff.role,
            staff.position,
            staff.email,
            staff.phone,
            staff.schoolId,
            staff.status
        ].join(','));
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `staff_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Export Successful", description: "Staff report has been downloaded as a CSV file." });
    };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Staff Reports"
        description="Create reports on staff attendance, roles, and performance metrics."
      />
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="font-headline">Staff Report Generator</CardTitle>
          <CardDescription>Use the filters below to generate a specific report, then print or export the results.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-4 border rounded-lg mb-6 bg-muted/50 print:hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="font-semibold text-lg flex items-center col-span-full md:col-span-1"><Filter className="mr-2 h-5 w-5" /> Filters</div>
                    <div>
                        <Label htmlFor="school-filter">School</Label>
                        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                            <SelectTrigger id="school-filter"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {uniqueSchools.map(school => <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="role-filter">Role</Label>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger id="role-filter"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {uniqueRoles.map(role => <SelectItem key={role} value={role}>{role === 'all' ? 'All Roles' : role}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="status-filter">Status</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger id="status-filter"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {uniqueStatuses.map(status => <SelectItem key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</SelectItem>)}
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
                ) : filteredStaff.length === 0 ? (
                    <Card className="mt-6 bg-muted/30">
                      <CardHeader><CardTitle className="font-headline text-base flex items-center"><AlertCircle className="mr-2 h-5 w-5" />No Staff Found</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-foreground">No staff members match your current filter criteria.</p></CardContent>
                    </Card>
                ) : (
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>School</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStaff.map(staff => (
                                    <TableRow key={staff.id}>
                                        <TableCell className="font-medium">{staff.name}</TableCell>
                                        <TableCell>{staff.role}</TableCell>
                                        <TableCell>{schoolData.find(s => s.id === staff.schoolId)?.name || 'N/A'}</TableCell>
                                        <TableCell>{staff.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariants[staff.status]} className={cn(statusVariants[staff.status] === 'default' && 'bg-green-600')}>
                                                {staff.status}
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
