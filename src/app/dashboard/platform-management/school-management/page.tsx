
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, AlertCircle, Eye, Edit, Trash2, MoreHorizontal, Users, PlusCircle } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from '@/components/layout/page-header';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, getDocs, query, where, deleteDoc, doc, getCountFromServer } from 'firebase/firestore';

interface School {
  id: string;
  name:string;
  address: string;
  type: string;
  userCount: number;
}

// SIMULATED BACKEND FETCH
async function fetchSchoolsWithUsers(): Promise<School[]> {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase is not configured.");
  }

  const schoolsSnapshot = await getDocs(collection(db, "schools"));
  
  const schools: School[] = await Promise.all(
    schoolsSnapshot.docs.map(async (schoolDoc) => {
      const school = schoolDoc.data();
      const usersQuery = query(collection(db, "users"), where("schoolId", "==", schoolDoc.id));
      const usersSnapshot = await getCountFromServer(usersQuery);
      const userCount = usersSnapshot.data().count;

      return {
        id: schoolDoc.id,
        name: school.name,
        address: school.address,
        type: school.type,
        userCount: userCount
      };
    })
  );

  return schools;
}

// SIMULATED BACKEND DELETE
async function deleteSchoolFromBackend(schoolId: string): Promise<{success: boolean}> {
    if (!db || !isFirebaseConfigured) {
      throw new Error("Firebase is not configured.");
    }
    // Note: In a real app, you'd need a Cloud Function for a cascading delete of all related data (users, inventory, etc.)
    await deleteDoc(doc(db, "schools", schoolId));
    console.log(`Successfully deleted school document for ID: ${schoolId}`);
    return { success: true };
}


export default function SchoolManagementPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadSchools = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      if (!isFirebaseConfigured) {
        setError("Firebase is not configured.");
        setIsLoading(false);
        return;
      }
      try {
        const fetchedSchools = await fetchSchoolsWithUsers();
        setSchools(fetchedSchools);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(msg);
        toast({ variant: "destructive", title: "Error Loading Schools", description: msg });
      } finally {
        setIsLoading(false);
      }
    }, [toast]);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  const handleSimulatedAction = (action: string, schoolName: string) => {
    toast({
      title: "Action Simulated",
      description: `The '${action}' action was clicked for ${schoolName}. This would trigger a real function in a live app.`,
    });
  };

  const handleRemoveSchool = async (schoolId: string, schoolName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${schoolName}" and all its associated data? This action cannot be undone.`)) {
        return;
    }

    toast({ title: "Removing School...", description: `Attempting to remove ${schoolName}.` });

    try {
        await deleteSchoolFromBackend(schoolId);
        await loadSchools(); // Refresh the list
        toast({
            title: "School Removed",
            description: `${schoolName} (ID: ${schoolId}) has been removed.`,
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "An unknown error occurred.";
        toast({
            variant: "destructive",
            title: "Removal Failed",
            description: msg,
        });
    }
  };

  return (
    <div className="flex flex-col gap-8">
        <PageHeader 
            title="School Management"
            description="View, manage, and edit schools on the platform."
        >
          <Link href="/dashboard/platform-management/school-management/create">
            <Button><PlusCircle className="mr-2 h-4 w-4" />Create School</Button>
          </Link>
        </PageHeader>
        <Card className="shadow-xl rounded-lg">
          <CardContent className="pt-6">
            {isLoading && (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            )}
            {!isLoading && error && (
              <Card className="bg-destructive/10 border-destructive">
                <CardHeader>
                  <CardTitle className="font-headline text-destructive flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5" /> Error
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}
            {!isLoading && !error && schools.length > 0 && (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>School ID</TableHead>
                      <TableHead>School Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-center">User Count</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.map(school => (
                      <TableRow key={school.id} className="font-body">
                        <TableCell className="font-mono">{school.id}</TableCell>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>{school.address}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{school.userCount}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleSimulatedAction('View', school.name)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => handleSimulatedAction('Manage Users', school.name)}>
                                <Users className="mr-2 h-4 w-4" /> Manage Users
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSimulatedAction('Edit', school.name)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit School Info
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                onClick={() => handleRemoveSchool(school.id, school.name)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Remove School
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
             {!isLoading && !error && schools.length === 0 && (
                <Card className="mt-6 bg-muted/30 border">
                    <CardHeader><CardTitle className="font-headline text-base flex items-center"><AlertCircle className="mr-2 h-5 w-5" />No Schools Found</CardTitle></CardHeader>
                    <CardContent><p className="font-body text-sm text-foreground">There are no schools to display. Use the 'Create School' button to add one.</p></CardContent>
                </Card>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
