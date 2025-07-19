"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from 'recharts';
import { 
  LogOut, Home, Users, Mail, Info, AlertTriangle, Loader2, Settings, PlusCircle, Trash2,
  DatabaseZap, RefreshCw, Lock, Edit, Printer, HelpCircle, CircleUserRound, History as HistoryIcon, Upload,
  KeyRound, ShieldCheck, Bot
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { staffData as sampleUsersSeedData } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider, Tooltip as UiTooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";


interface AdminMetrics {
  totalUsers: number;
  totalTasks: number;
  totalSchools: number;
}

interface ActivityLogEntry {
  timestamp: string; // ISO string
  user: string;
  action: string;
  details: string;
  timestampFormatted?: string;
}

interface ActiveUserSession {
  id: string;
  userName: string;
  role: string;
  schoolId: string;
  lastActivityTimestamp: string; // ISO string
  lastActivityFormatted?: string;
}

interface EmailLogEntry {
  id: string;
  timestamp: string; // ISO string
  sender: string;
  recipient: string;
  subject: string;
  status: 'Sent' | 'Delivered' | 'Opened' | 'Bounced' | 'Failed';
  timestampFormatted?: string;
}

interface NetworkStats {
  uptime: number;
  downtime: number;
  baseAvgSpeed: number;
  provider: string;
}

// --- Permission Group Interfaces & Mock Data ---
interface Permission {
  id: string;
  description: string;
}

interface PermissionGroup {
  id: string;
  name: string;
  permissions: string[];
  userIds: string[];
}

const allAvailablePermissions: Permission[] = [
  { id: 'view_all_workbooks', description: 'View all workbook plans' },
  { id: 'edit_all_workbooks', description: 'Edit all workbook plans' },
  { id: 'manage_disciplinary', description: 'Manage disciplinary records' },
  { id: 'manage_exam_results', description: 'Manage exam results' },
  { id: 'manage_staff', description: 'Manage staff records' },
  { id: 'send_invites', description: 'Send teacher invitations' },
  { id: 'access_kpi_reports', description: 'Access KPI reports' },
  { id: 'manage_ohs', description: 'Manage OHS records' },
  { id: 'manage_library', description: 'Manage Library services' },
];

const initialPermissionGroups: PermissionGroup[] = [
  {
    id: 'group_hod',
    name: 'Head of Department',
    permissions: ['view_all_workbooks', 'edit_all_workbooks', 'access_kpi_reports'],
    userIds: sampleUsersSeedData.filter(u => u.role === 'head-teacher').slice(0,1).map(u => u.id),
  },
  {
    id: 'group_discipline_committee',
    name: 'Discipline Committee',
    permissions: ['manage_disciplinary', 'manage_staff'],
    userIds: [],
  },
  {
    id: 'group_academic_board',
    name: 'Academic Board',
    permissions: ['manage_exam_results', 'view_all_workbooks'],
    userIds: [],
  },
];


const chartConfigBase = {
  count: { label: "Count" },
  users: { label: "Users", color: "hsl(var(--primary))" },
  tasks: { label: "Tasks", color: "hsl(var(--destructive))" },
  schools: { label: "Schools", color: "hsl(var(--primary))" },
} satisfies ChartConfig;


export default function SystemAdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveUserSession[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [currentAvgSpeed, setCurrentAvgSpeed] = useState<number>(0);
  
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>("N/A");
  const [initializationDate, setInitializationDate] = useState<string>("N/A");

  const [schoolIdInput, setSchoolIdInput] = useState('');
  const [isProcessingSchool, setIsProcessingSchool] = useState(false);
  const [isManagingData, setIsManagingData] = useState(false);

  // State for Permission Groups
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(initialPermissionGroups);
  const [newGroupName, setNewGroupName] = useState('');
  const [isProcessingGroup, setIsProcessingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(null);
  
  // State for editing within dialog
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);
  const [tempUserIds, setTempUserIds] = useState<string[]>([]);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState<string>('');

  // State for Platform Management
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeProgress, setUpgradeProgress] = useState(0);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [licenseSchoolId, setLicenseSchoolId] = useState('');
  const [licenseDuration, setLicenseDuration] = useState('1'); // Default to 1 year
  const [isExtendingLicense, setIsExtendingLicense] = useState(false);
  const [licenseLog, setLicenseLog] = useState<{ schoolId: string; duration: string; extendedAt: string }[]>([]);


  const fetchDataSimulator = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    const fetchedMetrics: AdminMetrics = { totalUsers: 1250, totalTasks: 780, totalSchools: 45 };
    setMetrics(fetchedMetrics);
    setChartData([
      { name: 'Users', count: fetchedMetrics.totalUsers, fill: "hsl(var(--primary))" },
      { name: 'Tasks', count: fetchedMetrics.totalTasks, fill: "hsl(var(--destructive))" },
      { name: 'Schools', count: fetchedMetrics.totalSchools, fill: "hsl(var(--primary))" },
    ]);

    const fetchedActivityLogs: ActivityLogEntry[] = [
      { timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), user: 'admin@example.com', action: 'LOGIN', details: 'Successful login via web.' },
      { timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), user: 'system', action: 'MAINTENANCE', details: 'Scheduled backup completed.' },
    ];
    setActivityLogs(fetchedActivityLogs.map(log => ({ ...log, timestampFormatted: new Date(log.timestamp).toLocaleString() })));

    const fetchedActiveSessions: ActiveUserSession[] = [
      { id: 'user1', userName: 'Ms. Senirosi Ledua', role: 'Teacher', schoolId: '3046', lastActivityTimestamp: new Date(Date.now() - 5 * 60000).toISOString() },
      { id: 'user2', userName: 'Mr. Nilesh Sharma', role: 'Head Teacher', schoolId: '3046', lastActivityTimestamp: new Date(Date.now() - 2 * 60000).toISOString() },
    ];
    setActiveSessions(fetchedActiveSessions.map(session => ({ ...session, lastActivityFormatted: new Date(session.lastActivityTimestamp).toLocaleString()})));
    
    const fetchedEmailLogs: EmailLogEntry[] = [
      { id: 'email1', timestamp: new Date(Date.now() - 10 * 60000).toISOString(), sender: 'system@tra.platform', recipient: 'teacher1@example.com', subject: 'Welcome to TRA Platform', status: 'Delivered' },
      { id: 'email2', timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(), sender: 'system@tra.platform', recipient: 'admin@example.com', subject: 'Weekly Digest Report', status: 'Opened' },
    ];
    setEmailLogs(fetchedEmailLogs.map(log => ({...log, timestampFormatted: new Date(log.timestamp).toLocaleString()})));

    const fetchedNetworkStats: NetworkStats = { uptime: 99.9, downtime: 0.1, baseAvgSpeed: 150.5, provider: 'Telecom Fiji' };
    setNetworkStats(fetchedNetworkStats);
    setCurrentAvgSpeed(fetchedNetworkStats.baseAvgSpeed);

    setLastUpdatedTime(new Date().toLocaleString());
    setInitializationDate(new Date().toLocaleDateString());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDataSimulator();
  }, [fetchDataSimulator]);
  
  useEffect(() => {
    let speedInterval: NodeJS.Timeout;
    if (networkStats) {
      speedInterval = setInterval(() => {
        const fluctuation = (Math.random() - 0.5) * 40;
        let newSpeed = networkStats.baseAvgSpeed + fluctuation;
        newSpeed = Math.max(50, Math.min(250, newSpeed));
        setCurrentAvgSpeed(parseFloat(newSpeed.toFixed(1)));
      }, 1000);
    }
    return () => clearInterval(speedInterval);
  }, [networkStats]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userRole');
        localStorage.removeItem('schoolId');
    }
    router.push('/'); 
  };
  
  const handleAddSchool = async () => {
    if (!schoolIdInput.trim()) {
        toast({ variant: "destructive", title: "Input Required", description: "Please enter a School ID to add." });
        return;
    }
    setIsProcessingSchool(true);
    toast({ title: "Initiating School Creation...", description: `Simulating data seeding for School ID: ${schoolIdInput}.` });

    console.log(`--- SIMULATING ADD SCHOOL: ${schoolIdInput} ---`);
    console.log("This would trigger a secure backend Cloud Function to seed data for a new school.");
    await new Promise(resolve => setTimeout(resolve, 2500));

    setIsProcessingSchool(false);
    toast({ title: "Simulation Complete", description: `School ID ${schoolIdInput} has been 'added'.` });
    setSchoolIdInput('');
  };

  const handleRemoveSchool = async () => {
    if (!schoolIdInput.trim()) {
        toast({ variant: "destructive", title: "Input Required", description: "Please enter a School ID to remove." });
        return;
    }
    if (!window.confirm(`Are you sure you want to remove School ID "${schoolIdInput}" and all its associated data? This is a destructive and irreversible action.`)) {
        return;
    }
    setIsProcessingSchool(true);
    toast({ title: "Initiating School Deletion...", description: `Simulating data deletion for School ID: ${schoolIdInput}.`, variant: "destructive" });

    console.log(`--- SIMULATING REMOVE SCHOOL: ${schoolIdInput} ---`);
    console.log("This would trigger a secure backend Cloud Function to perform a cascading delete of all data associated with this school ID.");
    await new Promise(resolve => setTimeout(resolve, 2500));

    setIsProcessingSchool(false);
    toast({ title: "Simulation Complete", description: `All data for School ID ${schoolIdInput} has been 'removed'.` });
    setSchoolIdInput('');
  };
  
  const handleClearData = async () => {
    if (!window.confirm("Are you sure you want to clear all data from the Firestore database? This action is irreversible.")) {
        return;
    }
    setIsManagingData(true);
    toast({ title: "Clearing Database...", description: "This may take a moment...", variant: "destructive" });
    
    // In a real app, this would be a secure API call to a backend function.
    // Simulating for now.
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({ title: "Database Cleared (Simulated)", description: "All data has been cleared." });

    setIsManagingData(false);
  };

  const handleSeedData = async () => {
    setIsManagingData(true);
    toast({ title: "Seeding Data...", description: "Connecting to the server to seed the database." });
    
    // Simulating for now.
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({ title: "Database Seeded (Simulated)", description: "Sample data has been loaded." });
    
    setIsManagingData(false);
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
        toast({ variant: "destructive", title: "Input Required", description: "Please enter a name for the new permission group." });
        return;
    }
    setIsProcessingGroup(true);
    const newGroup: PermissionGroup = {
        id: `group_${Date.now()}`,
        name: newGroupName,
        permissions: [],
        userIds: [],
    };
    setPermissionGroups(prev => [...prev, newGroup]);
    toast({ title: "Group Created", description: `Permission group "${newGroupName}" has been created.` });
    setNewGroupName('');
    setIsProcessingGroup(false);
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    if (window.confirm(`Are you sure you want to delete the "${groupName}" permission group?`)) {
        setPermissionGroups(prev => prev.filter(g => g.id !== groupId));
        toast({ title: "Group Deleted", description: `"${groupName}" has been removed.` });
    }
  };
  
  const handleEditGroup = (group: PermissionGroup) => {
    setEditingGroup(group);
    setTempPermissions(group.permissions);
    setTempUserIds(group.userIds);
    setSelectedUserToAdd('');
  };

  const handleSaveGroupPermissions = () => {
    if (!editingGroup) return;
    setPermissionGroups(prev => prev.map(g => g.id === editingGroup.id ? { ...g, permissions: tempPermissions, userIds: tempUserIds } : g));
    toast({ title: "Group Updated", description: `Permissions and users for "${editingGroup.name}" have been updated.` });
    setEditingGroup(null);
  };
  
  const handleAddUserToGroup = () => {
    if (selectedUserToAdd && !tempUserIds.includes(selectedUserToAdd)) {
        setTempUserIds(prev => [...prev, selectedUserToAdd]);
    }
    setSelectedUserToAdd('');
  };

  const handleRemoveUserFromGroup = (userIdToRemove: string) => {
    setTempUserIds(prev => prev.filter(id => id !== userIdToRemove));
  };
  
  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setUpgradeProgress(0);
    toast({ title: "Checking for updates..." });

    await new Promise(res => setTimeout(res, 1500));
    toast({ title: "Update found!", description: "Downloading version 2.1.0..." });
    
    const progressInterval = setInterval(() => {
        setUpgradeProgress(prev => {
            if (prev >= 100) {
                clearInterval(progressInterval);
                return 100;
            }
            return prev + 10;
        });
    }, 300);

    await new Promise(res => setTimeout(res, 3500));
    toast({ title: "Upgrade Complete", description: "Platform has been updated to version 2.1.0." });
    setIsUpgrading(false);
  };

  const handleToggleMaintenance = (checked: boolean) => {
    setIsMaintenanceMode(checked);
    toast({
        title: `Maintenance Mode ${checked ? 'Enabled' : 'Disabled'}`,
        description: checked ? "The platform is now in maintenance mode. Non-admins may see a maintenance page." : "The platform is now live.",
        variant: checked ? "destructive" : "default"
    });
  };
  
  const handleExtendLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseSchoolId.trim()) {
        toast({ variant: "destructive", title: "Input Required", description: "Please enter a School ID." });
        return;
    }
    setIsExtendingLicense(true);
    toast({ title: "Processing License...", description: `Adding a ${licenseDuration}-year license to School ID: ${licenseSchoolId}.` });

    await new Promise(res => setTimeout(res, 2000));
    
    setLicenseLog(prev => [{ schoolId: licenseSchoolId, duration: `${licenseDuration} Year(s)`, extendedAt: new Date().toLocaleString() }, ...prev]);
    toast({ title: "License Extended", description: `Successfully extended license for School ID ${licenseSchoolId}.` });
    setLicenseSchoolId('');
    setIsExtendingLicense(false);
  };

  const maxSimulatedSpeed = 300;
  const speedProgress = networkStats ? (currentAvgSpeed / maxSimulatedSpeed) * 100 : 0;

  const renderSkeletonCard = () => (
    <Card className="text-center shadow-lg">
      <CardHeader className="pb-2">
        <Skeleton className="h-10 w-1/2 mx-auto" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </CardContent>
    </Card>
  );

  const renderSkeletonTable = (cols = 4) => (
    <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
    </div>
  );

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-muted/40 font-body text-foreground">
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-headline font-bold">System Dashboard</h1>
            <UiTooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/90">
                        <HelpCircle className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs">This is the main control panel for the entire platform. Manage schools, users, and system-wide settings.</p>
                </TooltipContent>
            </UiTooltip>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
            <Link href="/dashboard">
                <Button 
                  variant="outline"
                  className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 h-auto"
                >
                  <Home size={16} className="mr-1 sm:mr-2" />
                  Dashboard
                </Button>
            </Link>
            <Link href="/dashboard/profile">
                <Button 
                  variant="outline"
                  className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 h-auto"
                >
                  <CircleUserRound size={16} className="mr-1 sm:mr-2" />
                  Profile
                </Button>
            </Link>
            <Link href="/dashboard/history">
                <Button 
                  variant="outline"
                  className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 h-auto"
                >
                  <HistoryIcon size={16} className="mr-1 sm:mr-2" />
                  History
                </Button>
            </Link>
            <Button 
              onClick={handleLogout} 
              variant="outline"
              className="bg-primary-foreground text-primary border-primary-foreground hover:bg-primary-foreground/90 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 h-auto"
            >
              <LogOut size={16} className="mr-1 sm:mr-2" />
              Logout
            </Button>
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6">
        <Card className="mb-6 bg-blue-50 border-blue-200 p-4 shadow print:hidden">
            <CardContent className="text-sm text-blue-700 font-body flex items-start">
                <AlertTriangle size={20} className="mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                <div>
                    <strong className="font-bold">Demonstration Notice:</strong> The data displayed on this System Admin Dashboard is <strong className="underline">simulated</strong> for illustrative purposes. In a live production environment, these statistics and logs would be dynamically fetched from backend services and databases.
                </div>
            </CardContent>
        </Card>

        <section aria-labelledby="metrics-summary" className="mb-6 bg-card p-4 rounded-lg shadow print:hidden">
          <h2 id="metrics-summary" className="sr-only">Metrics Summary List</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Total Users: <span className="font-semibold text-foreground">{isLoading || !metrics ? <Skeleton className="h-4 w-10 inline-block" /> : metrics.totalUsers}</span></li>
            <li>Total Tasks: <span className="font-semibold text-foreground">{isLoading || !metrics ? <Skeleton className="h-4 w-10 inline-block" /> : metrics.totalTasks}</span></li>
            <li>Total Schools: <span className="font-semibold text-foreground">{isLoading || !metrics ? <Skeleton className="h-4 w-8 inline-block" /> : metrics.totalSchools}</span></li>
            <li>Active School ID User Sessions (Simulated): <span className="font-semibold text-foreground">{isLoading ? <Skeleton className="h-4 w-8 inline-block" /> : activeSessions.length}</span></li>
            <li>Last Updated: <span className="font-semibold text-foreground">{isLoading ? <Skeleton className="h-4 w-24 inline-block" /> : lastUpdatedTime}</span></li>
          </ul>
        </section>
        
        <section aria-labelledby="statistics-cards" className="mb-8 print:hidden">
          <h2 id="statistics-cards" className="sr-only">Statistics Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading || !metrics ? (
                <> {renderSkeletonCard()} {renderSkeletonCard()} {renderSkeletonCard()} {renderSkeletonCard()} </>
            ) : (
                <>
                <Card className="text-center shadow-lg">
                    <CardHeader className="pb-2"><CardTitle className="text-4xl font-bold text-destructive">{metrics.totalUsers}</CardTitle></CardHeader>
                    <CardContent><p className="text-sm font-medium text-muted-foreground">Total Users</p></CardContent>
                </Card>
                <Card className="text-center shadow-lg">
                    <CardHeader className="pb-2"><CardTitle className="text-4xl font-bold text-destructive">{metrics.totalTasks}</CardTitle></CardHeader>
                    <CardContent><p className="text-sm font-medium text-muted-foreground">Total Tasks</p></CardContent>
                </Card>
                <Card className="text-center shadow-lg">
                    <CardHeader className="pb-2"><CardTitle className="text-4xl font-bold text-destructive">{metrics.totalSchools}</CardTitle></CardHeader>
                    <CardContent><p className="text-sm font-medium text-muted-foreground">Total Schools</p></CardContent>
                </Card>
                <Card className="text-center shadow-lg">
                    <CardHeader className="pb-2"><CardTitle className="text-lg sm:text-xl font-bold text-destructive pt-2">{lastUpdatedTime}</CardTitle></CardHeader>
                    <CardContent><p className="text-sm font-medium text-muted-foreground">Last Updated</p></CardContent>
                </Card>
                </>
            )}
          </div>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:hidden">
            <section aria-labelledby="active-users-section">
            <Card className="shadow-lg h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-headline text-xl text-primary flex items-center">
                        <Users className="mr-2 h-6 w-6" />
                        Active User Sessions
                    </CardTitle>
                    <UiTooltip>
                      <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent><p className="max-w-xs">A simulated list of users currently active on the platform.</p></TooltipContent>
                    </UiTooltip>
                  </div>
                </CardHeader>
                <CardContent>
                {isLoading ? renderSkeletonTable(4) : (
                    <>
                    <p className="text-xs text-muted-foreground mb-4">
                        This is a simulation. Real-time session tracking requires backend infrastructure.
                    </p>
                    <div className="overflow-x-auto rounded-md border max-h-60">
                        <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                            <TableHead className="text-foreground font-semibold">User</TableHead>
                            <TableHead className="text-foreground font-semibold">Role</TableHead>
                            <TableHead className="text-foreground font-semibold">School ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeSessions.length > 0 ? activeSessions.map((session) => (
                            <TableRow key={session.id}>
                                <TableCell className="text-sm">{session.userName}</TableCell>
                                <TableCell className="text-sm">{session.role}</TableCell>
                                <TableCell className="text-sm">{session.schoolId}</TableCell>
                            </TableRow>
                            )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground py-4">No active sessions.</TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </div>
                    </>
                )}
                </CardContent>
            </Card>
            </section>
            
            <section aria-labelledby="core-metrics-chart">
            <Card className="shadow-lg h-full">
                <CardHeader>
                   <div className="flex items-center gap-2">
                    <CardTitle className="font-headline text-xl text-primary">Core Metrics Overview</CardTitle>
                     <UiTooltip>
                      <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent><p className="max-w-xs">A visual comparison of key entities in the system.</p></TooltipContent>
                    </UiTooltip>
                   </div>
                </CardHeader>
                <CardContent>
                {isLoading || chartData.length === 0 ? <Skeleton className="h-[300px] w-full" /> : (
                    <ChartContainer config={chartConfigBase} className="h-[300px] w-full">
                        <BarChart data={chartData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <UiTooltip 
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: 'var(--radius)' }}
                        />
                        <Bar dataKey="count" radius={4}>
                            {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
                </CardContent>
            </Card>
            </section>
        </div>

        <div className="print:hidden">
            <section aria-labelledby="ai-assistance-section" className="mb-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl text-primary flex items-center">
                            <Bot className="mr-2 h-6 w-6" />
                            AI-Powered Assistance
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Click here to get help from your AI coding partner. Request new features, ask for bug fixes, or get explanations about your code.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/platform-management/ai-assistant">
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                                Launch Gemini AI Assistant
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </section>
            
            <section aria-labelledby="platform-management-section" className="mb-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary flex items-center">
                    <Settings className="mr-2 h-6 w-6" />
                    Platform Management
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Manage system-wide settings, software updates, and licenses.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Software Upgrade Section */}
                  <div className="p-4 border rounded-lg bg-background">
                    <div className="flex items-center gap-2">
                        <Label className="font-medium text-muted-foreground">Software Version &amp; Upgrades</Label>
                        <UiTooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">Simulates checking for new software versions. The progress bar shows a mock download and installation process.</p>
                            </TooltipContent>
                        </UiTooltip>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="secondary">Version 2.0.1 (Stable)</Badge>
                      <Button onClick={handleUpgrade} disabled={isUpgrading}>
                        {isUpgrading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        {isUpgrading ? 'Updating...' : 'Check for Upgrades'}
                      </Button>
                    </div>
                    {isUpgrading && (
                      <div className="mt-4">
                        <Progress value={upgradeProgress} className="w-full" />
                        <p className="text-xs text-muted-foreground mt-1 text-center">{upgradeProgress}%</p>
                      </div>
                    )}
                  </div>

                  {/* Maintenance Mode Section */}
                  <div className="p-4 border rounded-lg bg-background">
                    <Label className="font-medium text-muted-foreground">Maintenance Mode</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch id="maintenance-mode" checked={isMaintenanceMode} onCheckedChange={handleToggleMaintenance} />
                      <Label htmlFor="maintenance-mode" className="font-normal">Enable Maintenance Mode</Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">When enabled, only administrators will be able to access the platform. A maintenance page will be shown to all other users.</p>
                  </div>

                  {/* License Management Section */}
                  <div className="p-4 border rounded-lg bg-background">
                    <Label className="font-medium text-muted-foreground">License Management</Label>
                    <form onSubmit={handleExtendLicense} className="mt-2 space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-grow">
                          <Label htmlFor="license-school-id">School ID</Label>
                          <Input
                            id="license-school-id"
                            placeholder="Enter School ID to license"
                            value={licenseSchoolId}
                            onChange={(e) => setLicenseSchoolId(e.target.value)}
                            disabled={isExtendingLicense}
                          />
                        </div>
                        <div className="w-full sm:w-auto">
                          <Label htmlFor="license-duration">Duration</Label>
                          <Select value={licenseDuration} onValueChange={setLicenseDuration} disabled={isExtendingLicense}>
                            <SelectTrigger id="license-duration" className="w-full sm:w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Year</SelectItem>
                              <SelectItem value="2">2 Years</SelectItem>
                              <SelectItem value="3">3 Years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="submit" className="w-full sm:w-auto" disabled={isExtendingLicense || !licenseSchoolId.trim()}>
                        {isExtendingLicense ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                        Extend License
                      </Button>
                    </form>
                    {licenseLog.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent License Extensions:</h4>
                        <div className="overflow-x-auto rounded-md border max-h-40">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>School ID</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {licenseLog.map((log, index) => (
                                <TableRow key={index}>
                                  <TableCell>{log.schoolId}</TableCell>
                                  <TableCell>{log.duration}</TableCell>
                                  <TableCell>{log.extendedAt}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
design add