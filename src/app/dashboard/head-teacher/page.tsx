
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  BarChart3, Bell, FileText, LogOutIcon, Home, Printer, Download, AlertCircle, Users, MailWarning, CheckCircle, Award, TimerOff, 
  CalendarClock, UserCheck, Save, HelpCircle, ShieldAlert, Gavel, Building2, UsersRound, MailPlus, HeartHandshake, ClipboardCheck, Boxes, Target, MailCheck as MailCheckIcon, BarChart2 as BarChart2Icon, ArrowLeft
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { staffData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


type TabName = 'overview' | 'pending' | 'reports' | 'assessment';
type TaskStatus = 'Submitted' | 'Accepted' | 'Review' | 'Rejected' | 'Draft';

interface SchoolTask {
  id: string;
  teacherName: string;
  term: string;
  week: string;
  status: TaskStatus;
  submittedAt: string; // ISO Timestamp e.g. "2024-07-19T14:30:00.000Z"
  dueOn: string;       // ISO Timestamp
  schoolId?: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface TeacherAssessmentData {
  iwpDone: boolean;
  counsellingDone: boolean;
  workbookDone: boolean;
  healthInspectionDone: boolean;
  examResultsDone: boolean;
  outdoorDutiesDone: boolean;
  ohsDone: boolean;
  disciplinaryDone: boolean;
  notes: string;
}


// Simulated backend function to fetch tasks
async function fetchSchoolTasksFromBackend(schoolId?: string): Promise<SchoolTask[]> {
  console.log("Simulating fetch school tasks from backend...", { schoolId });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const dueDateWeek5 = '2024-07-19T17:00:00.000Z'; // Assume due Friday 5pm
  const dueDateWeek4 = '2024-07-12T17:00:00.000Z';

  return [
    // SENIROSI LEDUA: submitted on time (early)
    { id: 'task_sim_1', teacherName: 'SENIROSI LEDUA', term: '2', week: '5', status: 'Accepted', submittedAt: '2024-07-18T10:00:00.000Z', dueOn: dueDateWeek5 },
    // GAYLESHNI GAYETRI DEV: submitted late
    { id: 'task_sim_2', teacherName: 'GAYLESHNI GAYETRI DEV', term: '2', week: '4', status: 'Review', submittedAt: '2024-07-15T09:00:00.000Z', dueOn: dueDateWeek4 },
    // SHIVAM MELVIN RAJ: submitted late
    { id: 'task_sim_3', teacherName: 'SHIVAM MELVIN RAJ', term: '2', week: '5', status: 'Submitted', submittedAt: '2024-07-20T11:00:00.000Z', dueOn: dueDateWeek5 },
    // SEEMA SHARMA: submitted on time (very early)
    { id: 'task_sim_4', teacherName: 'SEEMA SHARMA', term: '2', week: '5', status: 'Rejected', submittedAt: '2024-07-15T16:00:00.000Z', dueOn: dueDateWeek5 },
     // GRACE WILSON: submitted on time (just in time)
    { id: 'task_sim_5', teacherName: 'GRACE WILSON', term: '2', week: '5', status: 'Submitted', submittedAt: '2024-07-19T16:59:00.000Z', dueOn: dueDateWeek5 },
  ];
}


// Simulated backend function to update task status
async function updateTaskStatusInBackend(taskId: string, newStatus: TaskStatus): Promise<{success: boolean, updatedTask?: SchoolTask}> {
  console.log(`Simulating update task ${taskId} to status ${newStatus} in backend...`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

async function saveTeacherAssessmentToBackend(teacherId: string, data: TeacherAssessmentData): Promise<{success: boolean}> {
    console.log(`Simulating save assessment for teacher ${teacherId}:`, data);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}


export default function HeadTeacherPage() {
  const [activeTab, setActiveTab] = useState<TabName>('overview');
  const [allSchoolTasks, setAllSchoolTasks] = useState<SchoolTask[]>([]);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null | undefined>(undefined);
  const router = useRouter();
  const { toast } = useToast();

  const [teacherAssessments, setTeacherAssessments] = useState<Record<string, TeacherAssessmentData>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('schoolId');
      setSchoolId(id);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (schoolId === undefined) return;
    
    setIsLoading(true);
    setFetchError(null);
    try {
      // Simulate fetching all teachers for the school
      let teachersForSchool: Teacher[] = [];
      if (schoolId) {
          teachersForSchool = staffData
            .filter(staff => staff.schoolId === schoolId && (staff.role.toLowerCase() === 'teacher' || staff.role.toLowerCase() === 'assistant-head-teacher'))
            .map(staff => ({ id: staff.id, name: staff.name }));
      }

      // If no teachers found for the current school, show some mock data as a fallback for demonstration purposes.
      if (teachersForSchool.length === 0) {
        toast({
          title: "Showing Mock Data",
          description: "No teachers found for your current context. Displaying sample data.",
        });
        teachersForSchool = staffData
          .filter(staff => staff.schoolId === 'SCH-001' && (staff.role.toLowerCase() === 'teacher' || staff.role.toLowerCase() === 'assistant-head-teacher'))
          .slice(0, 5) // Show up to 5 mock teachers
          .map(staff => ({ id: staff.id, name: staff.name }));
      }
      
      setAllTeachers(teachersForSchool);
      
      // Simulate fetching tasks
      const fetchedTasks = await fetchSchoolTasksFromBackend(schoolId || undefined);
      setAllSchoolTasks(fetchedTasks);

      // --- DERIVE ASSESSMENT STATUS ---
      const teachersWhoSubmittedWorkbook = new Set(fetchedTasks.map(task => task.teacherName.toLowerCase()));

      const initialAssessments: Record<string, TeacherAssessmentData> = {};
      teachersForSchool.forEach(teacher => {
          const hasSubmittedWorkbook = teachersWhoSubmittedWorkbook.has(teacher.name.toLowerCase());
          initialAssessments[teacher.id] = {
              iwpDone: Math.random() > 0.3, // Simulate 70% completion
              counsellingDone: Math.random() > 0.6, // Simulate 40% completion
              workbookDone: hasSubmittedWorkbook, // Derived from mock task data
              healthInspectionDone: Math.random() > 0.2, // Simulate 80% completion
              examResultsDone: Math.random() > 0.4, // Simulate 60% completion
              outdoorDutiesDone: Math.random() > 0.5, // Simulate 50% completion
              ohsDone: Math.random() > 0.7, // Simulate 30% completion
              disciplinaryDone: Math.random() > 0.65, // Simulate 35% completion
              notes: '' // Head Teacher's notes start empty
          };
      });
      setTeacherAssessments(initialAssessments);

    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load school data.");
      console.error("Fetch data error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const NavItem = ({ label, tabName, icon: Icon }: { label: string; tabName: TabName; icon: React.ElementType }) => (
    <div
      onClick={() => setActiveTab(tabName)}
      className={cn(
        "flex items-center space-x-2 p-3 mb-2 rounded-md cursor-pointer text-muted-foreground transition-colors font-medium",
        activeTab === tabName ? "bg-primary/10 text-primary font-semibold shadow-sm" : "hover:bg-muted/50"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </div>
  );
  
  const overviewCounts = useMemo(() => {
    return allSchoolTasks.reduce((acc, task) => {
      const statusKey = task.status.toLowerCase() as keyof typeof acc;
      acc[statusKey] = (acc[statusKey] || 0) + 1;
      return acc;
    }, { submitted: 0, accepted: 0, review: 0, rejected: 0, draft: 0 });
  }, [allSchoolTasks]);

  const submissionSummary = useMemo(() => {
    if (!allTeachers.length) {
      return {
        submittedCount: 0,
        notSubmittedTeachers: [],
        remindersSent: 0,
      };
    }
    // Assuming we check for any submission, not a specific week, for simplicity.
    const teachersWhoSubmitted = new Set(
      allSchoolTasks.map(task => task.teacherName.toLowerCase())
    );
    const submittedCount = teachersWhoSubmitted.size;
    const notSubmittedTeachers = allTeachers.filter(
      teacher => !teachersWhoSubmitted.has(teacher.name.toLowerCase())
    );
    // Simulate reminders sent for those who haven't submitted
    const remindersSent = notSubmittedTeachers.length;

    return { submittedCount, notSubmittedTeachers, remindersSent };
  }, [allSchoolTasks, allTeachers]);


  const pendingTasks = useMemo(() => {
    return allSchoolTasks.filter(task => task.status === 'Submitted' || task.status === 'Review');
  }, [allSchoolTasks]);

  const submissionPerformance = useMemo(() => {
    if (allSchoolTasks.length === 0) {
      return {
        onTimeCount: 0,
        lateCount: 0,
        earliestSubmission: null,
        latestSubmission: null,
        details: [],
      };
    }

    const details = allSchoolTasks.map(task => {
      const submittedDate = new Date(task.submittedAt);
      const dueDate = new Date(task.dueOn);
      const isLate = submittedDate > dueDate;
      return { ...task, isLate, submittedDate, dueDate };
    });

    const onTimeCount = details.filter(d => !d.isLate).length;
    const lateCount = details.filter(d => d.isLate).length;

    const sortedBySubmission = [...details].sort((a, b) => a.submittedDate.getTime() - b.submittedDate.getTime());
    
    const earliestSubmission = sortedBySubmission[0] || null;
    const latestSubmission = details.sort((a, b) => b.submittedDate.getTime() - a.submittedDate.getTime())[0] || null;

    return {
      onTimeCount,
      lateCount,
      earliestSubmission,
      latestSubmission,
      details: details.sort((a,b) => b.submittedDate.getTime() - a.submittedDate.getTime()), // Sort by most recent first for display
    };
  }, [allSchoolTasks]);


  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const taskToUpdate = allSchoolTasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    const result = await updateTaskStatusInBackend(taskId, newStatus);
    if (result.success) {
      setAllSchoolTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      toast({
        title: "Status Updated",
        description: `Task for ${taskToUpdate.teacherName} (Week ${taskToUpdate.week}) set to ${newStatus}.`,
      });
    } else {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update task status."});
    }
  };

  const handlePrintReport = () => {
    toast({
      title: "Printing Report",
      description: "Use your browser's print dialog to save as PDF or print the report.",
    });
    window.print();
  };

  const handleSaveToPdf = () => {
    toast({
      title: "Saving as PDF",
      description: "Use your browser's print dialog and select 'Save as PDF' to save the report.",
    });
    window.print();
  };

  const handleSaveToExcel = () => {
    if (submissionPerformance.details.length === 0) {
        toast({ title: "No Data", description: "There is no report data to export." });
        return;
    }

    const headers = ['Teacher', 'Week', 'Submitted At', 'Due On', 'Timeliness'];
    const rows = submissionPerformance.details.map(task => [
        `"${task.teacherName.replace(/"/g, '""')}"`, // Handle names with commas
        task.week,
        task.submittedDate.toLocaleString(),
        task.dueDate.toLocaleString(),
        task.isLate ? "Late" : "On-Time"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `submission_timeliness_report_${date}.csv`);
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    toast({ title: "Export to Excel (CSV)", description: "Report has been downloaded as a CSV file." });
  };


  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userRole');
        localStorage.removeItem('schoolId');
    }
    router.push('/');
  };

  const handleNotesChange = (teacherId: string, value: string) => {
    setTeacherAssessments(prev => ({
        ...prev,
        [teacherId]: {
            ...prev[teacherId],
            notes: value
        }
    }));
  };

  const handleSaveAssessment = async (teacherId: string, teacherName: string) => {
    const assessmentData = teacherAssessments[teacherId];
    if (!assessmentData) return;

    toast({ title: "Saving Assessment...", description: `Saving notes for ${teacherName}.`});
    const result = await saveTeacherAssessmentToBackend(teacherId, assessmentData);
    if (result.success) {
        toast({ title: "Assessment Notes Saved", description: `Notes for ${teacherName} have been saved.`});
    } else {
        toast({ variant: "destructive", title: "Save Failed", description: "Could not save teacher assessment notes."});
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-3xl font-headline font-bold text-primary">Loading School Data...</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
          </div>
          <Skeleton className="h-64 rounded-lg" />
        </section>
      );
    }

    if (fetchError) {
      return (
        <section className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-headline font-bold text-destructive mb-2">Error Loading Data</h1>
          <p className="font-body text-destructive-foreground mb-6">{fetchError}</p>
          <Button onClick={loadData} className="bg-primary text-primary-foreground">Try Again</Button>
        </section>
      );
    }


    switch (activeTab) {
      case 'overview':
        return (
          <section className="space-y-8">
            <div className="flex items-center gap-2">
                <h1 className="text-3xl font-headline font-bold text-primary">School Overview</h1>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <HelpCircle className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs">Get a quick glance at the status of teacher workbook submissions and overall school activity.</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="rounded-lg shadow-md">
                <CardHeader className="pb-2"><CardTitle className="text-lg font-headline text-primary">Submitted</CardTitle></CardHeader>
                <CardContent><p className="text-4xl font-bold text-blue-600">{overviewCounts['submitted'] || 0}</p></CardContent>
              </Card>
              <Card className="rounded-lg shadow-md">
                <CardHeader className="pb-2"><CardTitle className="text-lg font-headline text-primary">Accepted</CardTitle></CardHeader>
                <CardContent><p className="text-4xl font-bold text-green-600">{overviewCounts['accepted'] || 0}</p></CardContent>
              </Card>
              <Card className="rounded-lg shadow-md">
                <CardHeader className="pb-2"><CardTitle className="text-lg font-headline text-primary">Review</CardTitle></CardHeader>
                <CardContent><p className="text-4xl font-bold text-yellow-500">{overviewCounts['review'] || 0}</p></CardContent>
              </Card>
              <Card className="rounded-lg shadow-md">
                <CardHeader className="pb-2"><CardTitle className="text-lg font-headline text-primary">Rejected</CardTitle></CardHeader>
                <CardContent><p className="text-4xl font-bold text-destructive">{overviewCounts['rejected'] || 0}</p></CardContent>
              </Card>
            </div>
            
            <Card className="shadow-lg rounded-lg col-span-1 sm:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Weekly Workbook Submission Summary</CardTitle>
                <CardDescription className="font-body text-sm text-muted-foreground">
                  Summary of workbook plan submissions for the current period (data is simulated).
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 flex items-center"><CheckCircle className="mr-2 h-5 w-5" />Submitted Plans</h3>
                  <p className="text-3xl font-bold text-green-600">{submissionSummary.submittedCount}</p>
                  <p className="text-xs text-green-700">out of {allTeachers.length} teachers</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 flex items-center"><MailWarning className="mr-2 h-5 w-5" />Pending Reminders</h3>
                  <p className="text-3xl font-bold text-yellow-600">{submissionSummary.remindersSent}</p>
                  <p className="text-xs text-yellow-700">automated emails sent (simulated)</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 flex items-center"><Users className="mr-2 h-5 w-5" />Teachers Yet to Submit</h3>
                  {submissionSummary.notSubmittedTeachers.length > 0 ? (
                    <ul className="text-sm text-red-900 mt-2 list-disc list-inside max-h-40 overflow-y-auto">
                      {submissionSummary.notSubmittedTeachers.map(teacher => (
                        <li key={teacher.id}>{teacher.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">All teachers have submitted their plans. Well done!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">Administration & Records</CardTitle>
                    <CardDescription className="font-body text-sm text-muted-foreground">
                        Manage staff, users, and school-wide academic and operational records.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/dashboard/staff">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><UsersRound className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">Staff Records</p><p className="text-xs text-muted-foreground">View and manage all staff details.</p></div></Button>
                    </Link>
                    <Link href="/dashboard/invite-teachers">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><MailPlus className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">User Management</p><p className="text-xs text-muted-foreground">Invite and manage platform users.</p></div></Button>
                    </Link>
                    <Link href="/dashboard/iwp">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><Target className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">Individual Work Plan</p><p className="text-xs text-muted-foreground">Manage teacher work plans.</p></div></Button>
                    </Link>
                    <Link href="/dashboard/disciplinary">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><Gavel className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">Disciplinary Records</p><p className="text-xs text-muted-foreground">Access all student disciplinary entries.</p></div></Button>
                    </Link>
                    <Link href="/dashboard/counselling">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><HeartHandshake className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">Counselling Records</p><p className="text-xs text-muted-foreground">View confidential counselling notes.</p></div></Button>
                    </Link>
                    <Link href="/dashboard/academics/exam-results">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><ClipboardCheck className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">Exam Results</p><p className="text-xs text-muted-foreground">Manage and review all exam data.</p></div></Button>
                    </Link>
                     <Link href="/dashboard/academics/exam-summary">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><BarChart2Icon className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">Exam Summary</p><p className="text-xs text-muted-foreground">View aggregated exam performance.</p></div></Button>
                    </Link>
                    <Link href="/dashboard/health-safety">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><ShieldAlert className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">OHS Incidents</p><p className="text-xs text-muted-foreground">Oversee all reported OHS incidents.</p></div></Button>
                    </Link>
                </CardContent>
            </Card>

            <Card className="shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">Inventory Management</CardTitle>
                    <CardDescription className="font-body text-sm text-muted-foreground">
                        Quick access to school-wide inventory modules and summaries.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <Link href="/dashboard/academics/classroom-inventory">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><Boxes className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">Classroom Inventory</p><p className="text-xs text-muted-foreground">Manage supplies for each year level.</p></div></Button>
                    </Link>
                     <Link href="/dashboard/academics/inventory-summary">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><BarChart3 className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">Classroom Summary</p><p className="text-xs text-muted-foreground">View aggregated classroom stock.</p></div></Button>
                    </Link>
                     <Link href="/dashboard/inventory">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><Building2 className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">Primary Inventory</p><p className="text-xs text-muted-foreground">Manage fixed assets for the school.</p></div></Button>
                    </Link>
                     <Link href="/dashboard/inventory/summary">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto"><BarChart3 className="mr-4 h-6 w-6 text-primary" /><div><p className="font-bold">Primary Summary</p><p className="text-xs text-muted-foreground">View aggregated asset value.</p></div></Button>
                    </Link>
                </CardContent>
            </Card>
          </section>
        );
      case 'pending':
        return (
          <section>
             <div className="flex items-center gap-2 mb-6">
                <h1 className="text-3xl font-headline font-bold text-primary">Pending Tasks</h1>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <HelpCircle className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs">Review and update the status of tasks that teachers have submitted.</p>
                    </TooltipContent>
                </Tooltip>
            </div>
             <Card className="shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">Tasks Awaiting Review</CardTitle>
                     <CardDescription className="font-body text-sm text-muted-foreground">
                        Review tasks that have been submitted or are marked for review.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {pendingTasks.length === 0 ? (
                        <div className="text-center py-8">
                            <Bell className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                            <p className="font-body text-muted-foreground">No tasks currently pending review.</p>
                        </div>
                    ) : (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="font-semibold">Teacher Name</TableHead>
                            <TableHead className="font-semibold">Term</TableHead>
                            <TableHead className="font-semibold">Week</TableHead>
                            <TableHead className="font-semibold">Submitted On</TableHead>
                            <TableHead className="font-semibold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingTasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.teacherName}</TableCell>
                                <TableCell>{task.term}</TableCell>
                                <TableCell>{task.week}</TableCell>
                                <TableCell>{new Date(task.submittedAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                <Select 
                                    value={task.status}
                                    onValueChange={(value) => handleStatusChange(task.id, value as TaskStatus)}
                                >
                                    <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Set Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Accepted" className="text-green-600">Accept</SelectItem>
                                        <SelectItem value="Rejected" className="text-red-600">Reject</SelectItem>
                                        <SelectItem value="Review" className="text-yellow-500">Needs Review</SelectItem>
                                        <SelectItem value="Submitted" className="text-blue-600">Mark as Submitted</SelectItem>
                                    </SelectContent>
                                </Select>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
          </section>
        );
      case 'reports':
        return (
          <section>
            <div className="flex items-center gap-2 mb-6">
                <h1 className="text-3xl font-headline font-bold text-primary">Reports</h1>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <HelpCircle className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs">Analyze teacher submission timeliness and export reports to PDF or Excel (CSV).</p>
                    </TooltipContent>
                </Tooltip>
            </div>
             <div className="printable-area">
                <Card className="shadow-lg rounded-lg mb-8">
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">Submission Timeliness Report</CardTitle>
                    <CardDescription>Performance statistics based on submission timestamps.</CardDescription>
                </CardHeader>
                <CardContent>
                    {allSchoolTasks.length === 0 ? (
                    <div className="text-center py-8">
                        <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <p className="font-body text-muted-foreground">No task data available to generate a report.</p>
                    </div>
                    ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-green-50 border-green-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-800">On-Time Submissions</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                            <div className="text-2xl font-bold text-green-700">{submissionPerformance.onTimeCount}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-red-50 border-red-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-red-800">Late Submissions</CardTitle>
                            <TimerOff className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                            <div className="text-2xl font-bold text-red-700">{submissionPerformance.lateCount}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-800">Most Punctual</CardTitle>
                            <Award className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                            <div className="text-lg font-bold text-blue-700 truncate">{submissionPerformance.earliestSubmission?.teacherName}</div>
                            <p className="text-xs text-blue-600">
                                Submitted for Week {submissionPerformance.earliestSubmission?.week}
                            </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-yellow-50 border-yellow-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-800">Latest Submission</CardTitle>
                            <CalendarClock className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                            <div className="text-lg font-bold text-yellow-700 truncate">{submissionPerformance.latestSubmission?.teacherName}</div>
                            <p className="text-xs text-yellow-600">
                                Submitted for Week {submissionPerformance.latestSubmission?.week}
                            </p>
                            </CardContent>
                        </Card>
                        </div>
                        
                        <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">All Submissions</h3>
                        <div className="overflow-x-auto rounded-md border max-h-96">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Teacher</TableHead>
                                <TableHead>Week</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead>Due On</TableHead>
                                <TableHead>Timeliness</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissionPerformance.details.map(task => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.teacherName}</TableCell>
                                    <TableCell>{task.week}</TableCell>
                                    <TableCell>{task.submittedDate.toLocaleString()}</TableCell>
                                    <TableCell>{task.dueDate.toLocaleString()}</TableCell>
                                    <TableCell>
                                    <Badge variant={task.isLate ? "destructive" : "default"} className={!task.isLate ? "bg-green-600 hover:bg-green-700" : ""}>
                                        {task.isLate ? "Late" : "On-Time"}
                                    </Badge>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                        </div>
                    </div>
                    )}
                </CardContent>
                </Card>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-start mt-6 print:hidden">
                <Button onClick={handlePrintReport}>
                    <Printer className="mr-2 h-5 w-5" /> Print Report
                </Button>
                <Button onClick={handleSaveToPdf} variant="outline">
                    <Download className="mr-2 h-5 w-5" /> Save to PDF
                </Button>
                <Button onClick={handleSaveToExcel} variant="outline">
                    <Download className="mr-2 h-5 w-5" /> Save to Excel (CSV)
                </Button>
            </div>
          </section>
        );
      case 'assessment':
        return (
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <h1 className="text-3xl font-headline font-bold text-primary">Teacher Assessment</h1>
                     <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">This checklist shows the completion status of key administrative tasks for each teacher, derived from records across the platform. Add your own notes and save for your records.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">Teacher Task Completion Status</CardTitle>
                    <CardDescription>An automated checklist showing the completion status of key administrative tasks for each teacher. Add your own notes and save for your records.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {allTeachers.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-semibold whitespace-nowrap">Teacher Name</TableHead>
                              <TableHead className="text-center">
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help font-semibold">IWP</TooltipTrigger>
                                  <TooltipContent><p>Individual Work Plan</p></TooltipContent>
                                </Tooltip>
                              </TableHead>
                              <TableHead className="text-center">
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help font-semibold">Counselling</TooltipTrigger>
                                  <TooltipContent><p>Counselling Records</p></TooltipContent>
                                </Tooltip>
                              </TableHead>
                              <TableHead className="text-center">
                                 <Tooltip>
                                  <TooltipTrigger className="cursor-help font-semibold">Workbook</TooltipTrigger>
                                  <TooltipContent><p>Workbook Plan</p></TooltipContent>
                                </Tooltip>
                              </TableHead>
                              <TableHead className="text-center">
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help font-semibold">Health Inspection</TooltipTrigger>
                                  <TooltipContent><p>Health Inspection Forms</p></TooltipContent>
                                </Tooltip>
                              </TableHead>
                              <TableHead className="text-center">
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help font-semibold">Exam Results</TooltipTrigger>
                                  <TooltipContent><p>Exam Results Submitted</p></TooltipContent>
                                </Tooltip>
                              </TableHead>
                              <TableHead className="text-center">
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help font-semibold">Outdoor Duties</TooltipTrigger>
                                  <TooltipContent><p>Outdoor Duties Log</p></TooltipContent>
                                </Tooltip>
                              </TableHead>
                               <TableHead className="text-center">
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help font-semibold">OHS</TooltipTrigger>
                                  <TooltipContent><p>OHS Incident Reporting</p></TooltipContent>
                                </Tooltip>
                              </TableHead>
                              <TableHead className="text-center">
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help font-semibold">Disciplinary</TooltipTrigger>
                                  <TooltipContent><p>Disciplinary Records</p></TooltipContent>
                                </Tooltip>
                              </TableHead>
                              <TableHead>Notes</TableHead>
                              <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {allTeachers.map(teacher => {
                              const assessment = teacherAssessments[teacher.id] || { iwpDone: false, counsellingDone: false, workbookDone: false, healthInspectionDone: false, examResultsDone: false, outdoorDutiesDone: false, ohsDone: false, disciplinaryDone: false, notes: '' };
                              return (
                                <TableRow key={teacher.id}>
                                  <TableCell className="font-medium whitespace-nowrap">{teacher.name}</TableCell>
                                  <TableCell className="text-center p-2">
                                    <Checkbox id={`iwp-${teacher.id}`} checked={assessment.iwpDone} disabled aria-label={`${teacher.name} IWP status`} />
                                  </TableCell>
                                  <TableCell className="text-center p-2">
                                    <Checkbox id={`counselling-${teacher.id}`} checked={assessment.counsellingDone} disabled aria-label={`${teacher.name} Counselling status`} />
                                  </TableCell>
                                  <TableCell className="text-center p-2">
                                    <Checkbox id={`workbook-${teacher.id}`} checked={assessment.workbookDone} disabled aria-label={`${teacher.name} Workbook status`} />
                                  </TableCell>
                                  <TableCell className="text-center p-2">
                                    <Checkbox id={`health-${teacher.id}`} checked={assessment.healthInspectionDone} disabled aria-label={`${teacher.name} Health Inspection status`} />
                                  </TableCell>
                                  <TableCell className="text-center p-2">
                                    <Checkbox id={`exam-${teacher.id}`} checked={assessment.examResultsDone} disabled aria-label={`${teacher.name} Exam Results status`} />
                                  </TableCell>
                                  <TableCell className="text-center p-2">
                                    <Checkbox id={`outdoor-${teacher.id}`} checked={assessment.outdoorDutiesDone} disabled aria-label={`${teacher.name} Outdoor Duties status`} />
                                  </TableCell>
                                   <TableCell className="text-center p-2">
                                    <Checkbox id={`ohs-${teacher.id}`} checked={assessment.ohsDone} disabled aria-label={`${teacher.name} OHS status`} />
                                  </TableCell>
                                  <TableCell className="text-center p-2">
                                    <Checkbox id={`disciplinary-${teacher.id}`} checked={assessment.disciplinaryDone} disabled aria-label={`${teacher.name} Disciplinary status`} />
                                  </TableCell>
                                  <TableCell className="p-1">
                                    <Textarea value={assessment.notes} onChange={(e) => handleNotesChange(teacher.id, e.target.value)} placeholder="Add notes..." rows={1} className="min-w-[150px] text-xs h-8" />
                                  </TableCell>
                                  <TableCell className="text-center p-1">
                                    <Button size="icon" variant="ghost" onClick={() => handleSaveAssessment(teacher.id, teacher.name)} aria-label={`Save assessment notes for ${teacher.name}`}>
                                      <Save className="h-4 w-4 text-blue-600" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <p className="font-body text-muted-foreground">No teachers found for this school to assess.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
        );
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
    <div className="flex min-h-screen font-body bg-muted/40 text-foreground">
      <aside 
        className="w-64 bg-background border-r p-6 flex-col shadow-lg fixed inset-y-0 left-0 print:hidden hidden md:flex" 
      >
        <div className="mb-4 text-center flex items-center justify-center gap-2">
           <Link href="/dashboard" passHref>
             <Button variant="ghost" className="h-auto p-1">
                <ArrowLeft className="h-5 w-5 text-muted-foreground"/>
             </Button>
           </Link>
          <h2 className="text-xl font-headline font-bold text-primary pt-4 pb-2">Head Teacher</h2>
        </div>
        <nav className="flex-grow">
          <NavItem label="Overview" tabName="overview" icon={BarChart3} />
          <NavItem label="Pending Tasks" tabName="pending" icon={Bell} />
          <NavItem label="Reports" tabName="reports" icon={FileText} />
          <NavItem label="Teacher Assessment" tabName="assessment" icon={UserCheck} />
        </nav>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary mb-2 p-3">
                <Home size={18} className="mr-2" />
                Return to Dashboard
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Go back to the main user dashboard.</p>
          </TooltipContent>
        </Tooltip>
        <Button 
            onClick={handleLogout} 
            className="w-full mt-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold py-2.5"
        >
          <LogOutIcon size={18} className="mr-2"/>
          Logout
        </Button>
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-60">
        {renderContent()}
      </main>
    </div>
    </TooltipProvider>
  );
}
