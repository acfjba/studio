"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, History as HistoryIcon, Info, UploadCloud, ClipboardList, CalendarClock, Building, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PageHeader } from '@/components/layout/page-header';

export default function DashboardPage() {
  const [currentDateTime, setCurrentDateTime] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);
    
    if (typeof window !== 'undefined') {
      const storedSchoolId = localStorage.getItem('schoolId');
      setSchoolId(storedSchoolId || "N/A"); 
    }

    return () => clearInterval(timer);
  }, []);

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
                    <p className="max-w-xs">This is your main dashboard. Use the cards below for quick access to rate teachers, manage your workbook, or view your history.</p>
                </TooltipContent>
            </Tooltip>
        </PageHeader>
        
        <div className="mt-3 inline-block rounded-full bg-muted text-muted-foreground px-4 py-1.5 text-xs shadow-inner">
            <div className="flex items-center space-x-3">
              {schoolId && (
                <div className="flex items-center">
                  <Building className="mr-1.5 h-3.5 w-3.5" />
                  <span>School ID: {schoolId}</span>
                </div>
              )}
              <div className="flex items-center">
                <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
                <span>{currentDateTime || 'Loading date/time...'}</span>
              </div>
            </div>
        </div>

        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="sr-only">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  Workbook Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-body mb-4">
                  Manage and submit your weekly workbook plans.
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
