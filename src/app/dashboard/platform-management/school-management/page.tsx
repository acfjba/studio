
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, AlertCircle, Eye, Edit, Trash2, MoreHorizontal, Users } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { staffData, schoolData } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from '@/components/layout/page-header';

interface SchoolUser {
  name: string;
  email: string;
  role: string;
}

interface School {
  id: string;
  name:string;
  contactEmail: string;
  users: SchoolUser[];
}

// SIMULATED BACKEND FETCH
async function fetchSchoolsWithUsers(): Promise<School[]> {
  console.log("Simulating fetch of all schools with user data...");
  await new Promise(resolve => setTimeout(resolve, 1200));

  return schoolData.map(school => {
    const users = staffData
      .filter(u => u.schoolId === school.id)
      .map(u => ({ name: u.name, email: u.email, role: u.role }));
    return {
      ...school,
      contactEmail: users.find(u => u.role.toLowerCase() === 'principal')?.email || `contact@${school.id}.edu`,
      users,
    };
  });
}

// SIMULATED BACKEND DELETE
async function deleteSchoolFromBackend(schoolId: string): Promise<{success: boolean}> {
    console.log(`Simulating DELETE request for school ID: ${schoolId}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Successfully simulated deletion for school ID: ${schoolId}`);
    return { success: true };
}


export default function SchoolManagementPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadSchools = async () => {
      setIsLoading(true);
      setError(null);
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
    };
    loadSchools();
  }, [toast]);

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

    toast({ title: "Removing School...", description: `Simulating removal of ${schoolName}.` });

    const result = await deleteSchoolFromBackend(schoolId);

    if (result.success) {
        setSchools(currentSchools => currentSchools.filter(school => school.id !== schoolId));
        toast({
            title: "School Removed (Simulated)",
            description: `${schoolName} (ID: ${schoolId}) and all its data have been removed.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Removal Failed",
            description: `Could not remove ${schoolName}. Please try again.`,
        });
    }
  };

  return (
    <div className="flex flex-col gap-8">
        <PageHeader 
            title="School Management"
            description="View, manage, and edit schools on the platform. (Data is simulated)"
        />
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
                      <TableHead>Contact Email</TableHead>
                      <TableHead className="text-center">User Count</TableHead>
                      <TableHead>Users Preview</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.map(school => (
                      <TableRow key={school.id} className="font-body">
                        <TableCell className="font-mono">{school.id}</TableCell>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>{school.contactEmail}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{school.users.length}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={school.users.map(u => `${u.name} (${u.role})`).join(', ')}>
                          {school.users.slice(0, 3).map(u => u.name).join(', ')}
                          {school.users.length > 3 && ` + ${school.users.length - 3} more`}
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
                    <CardContent><p className="font-body text-sm text-foreground">There are no schools to display. All schools may have been removed.</p></CardContent>
                </Card>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
