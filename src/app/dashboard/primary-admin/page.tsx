
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  LayoutGrid, UserCog, GraduationCap, Settings2, DatabaseZap, LogOut, Home,
  Users, UserPlus, ClipboardList, ClipboardCheck, Gavel, HeartPulse, ShieldAlert, Library as LibraryIcon, LineChartIcon, FileText, HelpCircle, Building2, BookOpen
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PageHeader } from '@/components/layout/page-header';

type AdminSection = 'overview' | 'userManagement' | 'academicRecords' | 'schoolOperations' | 'dataReports';

interface AdminNavItem {
  label: string;
  section: AdminSection;
  icon: React.ElementType;
}

interface AdminSubNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const primaryAdminNavItems: AdminNavItem[] = [
  { label: "Overview", section: "overview", icon: LayoutGrid },
  { label: "User Management", section: "userManagement", icon: UserCog },
  { label: "Academic Records", section: "academicRecords", icon: GraduationCap },
  { label: "School Operations", section: "schoolOperations", icon: Settings2 },
  { label: "Data & Reports", section: "dataReports", icon: DatabaseZap },
];

const adminSubNavs: Record<AdminSection, AdminSubNavItem[]> = {
  overview: [], 
  userManagement: [
    { label: "Staff Records", href: "/dashboard/staff", icon: Users },
    { label: "Invite Teachers", href: "/dashboard/invite-teachers", icon: UserPlus },
    { label: "Teacher List & Ratings", href: "/dashboard/teachers", icon: Users },
  ],
  academicRecords: [
    { label: "AI Workbook Plan", href: "/dashboard/workbook-plan", icon: ClipboardList },
    { label: "Lesson Planner", href: "/dashboard/lesson-planner", icon: BookOpen },
    { label: "Exam Results Management", href: "/dashboard/academics/exam-results", icon: ClipboardCheck },
    { label: "Disciplinary Records", href: "/dashboard/disciplinary", icon: Gavel },
  ],
  schoolOperations: [
    { label: "Health & Safety", href: "/dashboard/health-safety", icon: ShieldAlert },
    { label: "Library Service", href: "/dashboard/library", icon: LibraryIcon },
    { label: "Primary School Inventory", href: "/dashboard/inventory", icon: Building2 },
  ],
  dataReports: [
    { label: "KPI Reports", href: "/dashboard/reporting/kpi", icon: LineChartIcon },
    { label: "Upload Data", href: "/dashboard/upload-data", icon: DatabaseZap },
  ]
};

const mockAdminStats = {
  totalStudents: 1250,
  totalStaff: 150,
  activeWorkbookSubmissions: 35,
  openDisciplinaryCases: 5,
  systemHealth: "Optimal",
  lastBackup: "2024-07-01T10:00:00.000Z", 
};

export default function PrimaryAdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [currentLastBackup, setCurrentLastBackup] = useState("Loading date...");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setCurrentLastBackup(new Date(mockAdminStats.lastBackup).toLocaleDateString());
  }, []);


  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userRole');
        localStorage.removeItem('schoolId');
    }
    router.push('/');
  };

  const NavItem = ({ label, section, icon: Icon }: AdminNavItem) => (
    <div
      onClick={() => setActiveSection(section)}
      className={cn(
        "flex items-center space-x-3 p-3 mb-2 rounded-md cursor-pointer text-foreground transition-colors font-medium",
        activeSection === section ? "bg-primary/10 text-primary font-semibold shadow-sm" : "hover:bg-muted/50"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </div>
  );

  const renderOverviewContent = () => {
    return (
      <section>
        <PageHeader title="Primary Admin Overview" description="View key statistics and system alerts for your school. Navigate to other sections using the left menu." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-lg shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-headline text-primary">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">{mockAdminStats.totalStudents}</p>
            </CardContent>
          </Card>
          <Card className="rounded-lg shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-headline text-primary">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">{mockAdminStats.totalStaff}</p>
            </CardContent>
          </Card>
          <Card className="rounded-lg shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-headline text-primary">Last Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-muted-foreground">{currentLastBackup}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  };

  const renderLinkSection = (section: AdminSection) => {
    const subItems = adminSubNavs[section];
    const sectionTitle = primaryAdminNavItems.find(nav => nav.section === section)?.label || "Section";
    if (!subItems || subItems.length === 0) return <p>No actions available in this section.</p>;

    return (
      <section>
        <PageHeader title={sectionTitle} description={`This section provides quick links to all pages related to ${sectionTitle}. Click a card to navigate.`} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subItems.map(item => {
            const ItemIcon = item.icon;
            return (
              <Card key={item.href} className="shadow-lg hover:shadow-xl transition-shadow rounded-lg border-muted">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary flex items-center">
                    <ItemIcon className="mr-2 h-6 w-6" />
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={item.href}>
                    <Button className="w-full">
                      Go to {item.label}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    );
  };

  const renderContent = () => {
    if (activeSection === 'overview') {
      return renderOverviewContent();
    }
    return renderLinkSection(activeSection);
  };

  return (
    <TooltipProvider>
        <div className="flex min-h-screen font-body bg-muted/40 text-foreground">
        <aside 
            className="w-64 bg-background border-r p-6 flex-col shadow-lg fixed inset-y-0 left-0 print:hidden hidden md:flex" 
        >
            <div className="mb-6 text-center">
            <h2 className="text-2xl font-headline font-bold text-primary pt-4 pb-2">Primary Admin</h2>
            </div>
            <nav className="flex-grow space-y-1">
            {primaryAdminNavItems.map((item) => (
                <NavItem key={item.section} {...item} />
            ))}
            </nav>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-accent/50 mb-2 p-3">
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
                className="w-full mt-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
            <LogOut size={18} className="mr-2"/>
            Logout
            </Button>
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-64">
            {renderContent()}
        </main>
        </div>
    </TooltipProvider>
  );
}
