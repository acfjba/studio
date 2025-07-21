
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Building, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { usersSeedData, schoolData } from '@/lib/seed-data';

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  schoolId: string | null;
  schoolName: string;
}

// SIMULATED BACKEND FETCH
async function fetchStudentRecordsFromBackend(): Promise<StudentRecord[]> {
  console.log("Simulating fetch of student records...");
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter users to only include those with the 'student' role (or similar)
  // For this demo, we'll imagine some users are students. We can filter by email pattern.
  const students = usersSeedData
    .filter(user => user.role === 'teacher' || user.email.includes('student')) // Mocking some users as students
    .map(user => {
        const school = schoolData.find(s => s.id === user.schoolId);
        return {
            id: user.id,
            name: user.displayName,
            email: user.email,
            schoolId: user.schoolId,
            schoolName: school?.name || 'N/A'
        };
    });
  
  // Add some dedicated mock students for variety
  students.push({ id: 'stu-001', name: 'Ratu Penaia', email: 'r.penaia@student.suvagrammar.ac.fj', schoolId: 'SCH-001', schoolName: 'Suva Grammar School' });
  students.push({ id: 'stu-002', name: 'Adi Litia', email: 'a.litia@student.natabuahigh.ac.fj', schoolId: 'SCH-002', schoolName: 'Natabua High School' });

  return students;
}


export default function StudentRecordsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolIdFilter, setSchoolIdFilter] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  const loadStudentData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
        const fetchedStudents = await fetchStudentRecordsFromBackend();
        setStudents(fetchedStudents);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "An unknown error occurred.";
        setFetchError(msg);
        toast({ variant: "destructive", title: "Error", description: "Could not load student data." });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const schoolId = localStorage.getItem('schoolId');
    setUserRole(role);
    // Auto-filter by school for non-admins
    if (role && role !== 'system-admin' && schoolId) {
        setSchoolIdFilter(schoolId);
    }
    loadStudentData();
  }, [loadStudentData]);

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!schoolIdFilter || student.schoolId === schoolIdFilter)
    );
  }, [students, searchTerm, schoolIdFilter]);

  const isSystemAdmin = userRole === 'system-admin';

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Student Records"
        description="A comprehensive directory of all students across the schools."
      />
      <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        id="search-students"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-80"
                    />
                </div>
                 {isSystemAdmin && (
                    <Input
                        id="search-school"
                        placeholder="Filter by School ID..."
                        value={schoolIdFilter}
                        onChange={(e) => setSchoolIdFilter(e.target.value)}
                        className="w-full sm:w-auto"
                    />
                )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            )}
            {!isLoading && fetchError && (
              <Card className="bg-destructive/10 border-destructive">
                <CardHeader>
                  <CardTitle className="font-headline text-destructive flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5" /> Error Loading Data
                  </CardTitle>
                </CardHeader>
                <CardContent><p className="font-body text-destructive">{fetchError}</p></CardContent>
              </Card>
            )}
            {!isLoading && !fetchError && (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span>{student.schoolName} ({student.schoolId})</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button variant="outline" size="sm">View Profile</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          No student records found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
