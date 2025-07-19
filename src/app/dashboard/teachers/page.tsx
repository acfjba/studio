
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, ShieldCheck, User, Info, AlertCircle, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { sampleStaffSeedData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PageHeader } from '@/components/layout/page-header';

interface Teacher {
  id: string;
  name: string;
  position: string;
  email: string;
  avatar: string;
  dataAiHint: string;
  schoolId: string;
  isRateable: boolean;
  role: string;
}

// SIMULATED BACKEND FETCH using the central seed file
async function fetchTeachersFromBackend(): Promise<Teacher[]> {
  console.log("Simulating fetch teachers from backend...");
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return sampleStaffSeedData
    .map(staff => {
        const rateablePositions = ["teacher", "head teacher", "assistant head teacher"];
        const isRateable = rateablePositions.includes((staff.role || "").toLowerCase());
        return {
            id: staff.id,
            name: staff.name,
            position: staff.position,
            email: staff.email,
            avatar: `https://placehold.co/80x80.png`,
            dataAiHint: "teacher portrait",
            schoolId: staff.schoolId,
            isRateable,
            role: staff.role
        };
    });
}

export default function TeachersListPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolIdFilter, setSchoolIdFilter] = useState('');
  const { toast } = useToast();
  const [loggedInSchoolId, setLoggedInSchoolId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedSchoolId = localStorage.getItem('schoolId');
        const storedUserRole = localStorage.getItem('userRole');
        setLoggedInSchoolId(storedSchoolId);
        setUserRole(storedUserRole);
        // Automatically apply the school filter if the user is not a system admin
        if (storedUserRole !== 'system-admin' && storedSchoolId) {
            setSchoolIdFilter(storedSchoolId);
        }
    }
    
    const loadTeachers = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const fetchedTeachers = await fetchTeachersFromBackend();
        setTeachers(fetchedTeachers);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "An unknown error occurred.");
        toast({ variant: "destructive", title: "Error", description: "Could not load teacher data." });
      } finally {
        setIsLoading(false);
      }
    };
    loadTeachers();
  }, [toast]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher =>
      (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       teacher.position.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!schoolIdFilter || teacher.schoolId === schoolIdFilter)
    );
  }, [teachers, searchTerm, schoolIdFilter]);
  
  const isSystemAdmin = userRole === 'system-admin';

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-8">
        <PageHeader 
            title="View & Rate Teachers"
            description="Browse the list of teachers. You can only rate teachers from your own school."
        />
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Input
                    id="search-teachers"
                    placeholder="Search by name or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                />
                 {isSystemAdmin && (
                    <Input
                        id="search-school"
                        placeholder="Filter by School ID..."
                        value={schoolIdFilter}
                        onChange={(e) => setSchoolIdFilter(e.target.value)}
                        className="max-w-xs"
                    />
                )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="flex flex-col items-center p-4">
                    <Skeleton className="h-20 w-20 rounded-full mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </Card>
                ))}
              </div>
            )}
            {!isLoading && fetchError && (
              <div className="text-center py-10">
                <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                <p className="mt-4 text-destructive">{fetchError}</p>
              </div>
            )}
            {!isLoading && !fetchError && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                  <Card key={teacher.id} className="p-4 flex flex-col items-center text-center space-y-3">
                    <Image
                      src={teacher.avatar}
                      alt={`Photo of ${teacher.name}`}
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-primary object-cover"
                      data-ai-hint={teacher.dataAiHint}
                    />
                    <div className="space-y-1">
                      <h3 className="font-headline text-lg font-semibold text-primary">{teacher.name}</h3>
                      <p className="text-sm text-muted-foreground">{teacher.position}</p>
                       <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <Building className="h-3 w-3" /> School ID: {teacher.schoolId}
                        </p>
                    </div>
                    {teacher.isRateable ? (
                      <Link href={`/dashboard/teachers/${teacher.id}/rate`} passHref className="w-full">
                        <Button className="w-full">
                          <Star className="mr-2 h-4 w-4" /> Rate Teacher
                        </Button>
                      </Link>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button className="w-full" disabled>
                               <Star className="mr-2 h-4 w-4" /> Not Rateable
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This user's role ({teacher.role}) is not eligible for rating.</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
