
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, History as HistoryIcon, Info, UploadCloud, ClipboardList, HelpCircle, Building, UserCog } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PageHeader } from '@/components/layout/page-header';

export default function DashboardPage() {
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Set the initial time on the client
    setCurrentDateTime(new Date());

    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    if (typeof window !== 'undefined') {
      const storedSchoolId = localStorage.getItem('schoolId');
      setSchoolId(storedSchoolId); 
      const storedUserRole = localStorage.getItem('userRole');
      setUserRole(storedUserRole);
    }

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const isAdmin = userRole === 'system-admin';

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-8">
        <PageHeader 
            title="Welcome to Digital Platform for Schools"
            description="Your central hub for managing school activities, ratings, and plans."
        >
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs">This is your main dashboard. Use the cards below for quick access to key modules.</p>
                </TooltipContent>
            </Tooltip>
        </PageHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex justify-center">
                 <div className="w-64 h-64 rounded-full border-8 border-primary/20 bg-card shadow-2xl flex flex-col items-center justify-center text-center p-4">
                    {currentDateTime ? (
                        <>
                            <p className="text-4xl font-bold font-headline text-foreground">
                                {currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                            </p>
                            <p className="text-lg text-muted-foreground mt-2">
                                {currentDateTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </>
                    ) : (
                        <p className="text-lg text-muted-foreground">Loading time...</p>
                    )}
                </div>
            </div>
             <div className="md:col-span-2">
                 {schoolId && (
                    <div className="inline-block rounded-full bg-muted text-muted-foreground px-4 py-2 text-lg shadow-inner mb-6">
                        <div className="flex items-center space-x-3">
                            <Building className="mr-1.5 h-4 w-4" />
                            <span>School ID: {schoolId}</span>
                        </div>
                    </div>
                 )}
                <p className="text-lg text-muted-foreground">
                    Use the quick action cards below to navigate to key sections of the platform.
                </p>
            </div>
        </div>


        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="sr-only">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {isAdmin && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-lg">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary flex items-center">
                      <UserCog className="mr-2 h-6 w-6" />
                      Admin Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-body mb-4">
                      Access your specific admin dashboard for management tasks.
                    </CardDescription>
                    <Link href={'/dashboard/platform-management'} passHref>
                      <Button className="w-full">
                        Go to Admin Dashboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
             )}

            <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center">
                  <Users className="mr-2 h-6 w-6" />
                  View Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-body mb-4">
                  Browse the list of teachers and submit ratings.
                </CardDescription>
                <Link href="/dashboard/teachers" passHref>
                  <Button className="w-full">
                    Go to Teacher List
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center">
                  <ClipboardList className="mr-2 h-6 w-6" />
                  AI Workbook Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-body mb-4">
                  Use AI to generate and submit your weekly workbook plans.
                </CardDescription>
                <Link href="/dashboard/workbook-plan" passHref>
                  <Button className="w-full">
                    Go to Workbook Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center">
                  <HistoryIcon className="mr-2 h-6 w-6" />
                  My Rating History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-body mb-4">
                  Review the ratings you have submitted in the past.
                </CardDescription>
                <Link href="/dashboard/history" passHref>
                  <Button className="w-full">
                    View My Ratings
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {isAdmin && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary flex items-center">
                    <UploadCloud className="mr-2 h-6 w-6" />
                    Upload Data
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="font-body mb-4">
                    Upload Excel sheets and provide additional details for processing.
                    </CardDescription>
                    <Link href="/dashboard/upload-data" passHref>
                    <Button className="w-full">
                        Go to Upload Page
                    </Button>
                    </Link>
                </CardContent>
                </Card>
            )}

             <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center">
                  <Info className="mr-2 h-6 w-6" />
                  How to Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-body mb-4">
                  Learn about the rating criteria and how to effectively provide feedback.
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      </TooltipProvider>
  );
}
