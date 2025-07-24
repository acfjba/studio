
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Building, AlertCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  schoolId: string | null;
  schoolName: string;
}

// SIMULATED BACKEND FETCH
async function fetchStudentRecordsFromBackend(schoolId: string): Promise<StudentRecord[]> {
  if (!db) throw new Error("Firestore is not configured.");
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("schoolId", "==", schoolId));
  const snapshot = await getDocs(q);
  
  // This is a simplified version. In a real app, you might fetch school names separately
  // or store them on the user document. For now, we'll just show the ID.
  return snapshot.docs.map(doc => {
      const user = doc.data();
      return {
          id: doc.id,
          name: user.displayName,
          email: user.email,
          schoolId: user.schoolId,
          schoolName: `School ${user.schoolId || 'N/A'}`
      };
  });
}


export default function StudentRecordsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  const loadStudentData = useCallback(async () => {
    if (!schoolId) {
      if (isFirebaseConfigured) setFetchError("School ID not found. Cannot load data.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setFetchError(null);
    try {
        const fetchedStudents = await fetchStudentRecordsFromBackend(schoolId);
        setStudents(fetchedStudents);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "An unknown error occurred.";
        setFetchError(msg);
        toast({ variant: "destructive", title: "Error", description: "Could not load student data." });
    } finally {
        setIsLoading(false);
    }
  }, [schoolId, toast]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const id = localStorage.getItem('schoolId');
    setUserRole(role);
    setSchoolId(id);
  }, []);

  useEffect(() => {
      loadStudentData();
  }, [loadStudentData]);

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, searchTerm]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Student Records"
        description="A comprehensive directory of all students in your school."
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
                      Firebase is not configured. This page is in read-only mode and cannot load live data.
                  </p>
              </CardContent>
          </Card>
      )}

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
                      <TableHead>School ID</TableHead>
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
                                <span>{student.schoolId}</span>
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
