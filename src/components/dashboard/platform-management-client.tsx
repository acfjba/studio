
"use client";

import React from 'react';
import Link from 'next/link';
import { 
    BarChart2, UserCog, Users, Building, DatabaseZap, Settings, Bot, Mail,
    GraduationCap, Warehouse, ShieldCheck, Contact, FileText, BookOpen, Boxes, Library,
    UsersRound, MailPlus, ClipboardCheck, Gavel, HeartHandshake, BarChart3, Star, History, Wifi
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AdminLink {
    href: string;
    icon: React.ElementType;
    title: string;
    description: string;
}

const platformAdminLinks: AdminLink[] = [
    { href: "/dashboard/platform-management/ai-assistant", icon: Bot, title: "AI Assistant", description: "Develop the app with AI." },
    { href: "/dashboard/platform-management/app-settings", icon: Settings, title: "App Settings", description: "Configure system-wide settings." },
    { href: "/dashboard/platform-management/firebase-config", icon: DatabaseZap, title: "Firebase Status", description: "View Firebase status and manage data." },
    { href: "/dashboard/platform-management/platform-status", icon: Wifi, title: "Platform Status", description: "Monitor school connectivity." },
    { href: "/dashboard/email", icon: Mail, title: "Bulk Email", description: "Send an email to all users." },
    { href: "/dashboard/upload-data", icon: DatabaseZap, title: "Upload Data", description: "Bulk upload data from files." },
    { href: "/dashboard/document-vault", icon: FileText, title: "Document Vault", description: "Access all saved documents." },
];

const schoolUserLinks: AdminLink[] = [
    { href: "/dashboard/platform-management/school-management", icon: Building, title: "School Management", description: "View, create, and manage all schools." },
    { href: "/dashboard/user-management", icon: UserCog, title: "User Management", description: "Invite users and manage roles." },
    { href: "/dashboard/staff", icon: UsersRound, title: "Staff Records", description: "Manage staff information." },
    { href: "/dashboard/teachers", icon: Star, title: "Teacher Directory", description: "View and rate teachers." },
    { href: "/dashboard/history", icon: History, title: "My Rating History", description: "Review your submitted ratings."},
    { href: "/dashboard/contacts", icon: Contact, title: "Contacts Directory", description: "View all school contacts." },
];

const academicsLinks: AdminLink[] = [
     { href: "/dashboard/academics", icon: GraduationCap, title: "Academics Hub", description: "Central point for academic management." },
     { href: "/dashboard/lesson-planner", icon: BookOpen, title: "Lesson Planner", description: "Create detailed lesson plans." },
     { href: "/dashboard/workbook-plan", icon: BookOpen, title: "AI Workbook Plan", description: "Generate workbook plans with AI." },
     { href: "/dashboard/iwp", icon: FileText, title: "Individual Work Plan", description: "Manage teacher IWPs." },
     { href: "/dashboard/head-teacher", icon: GraduationCap, title: "Head Teacher Panel", description: "Oversee teacher submissions." },
];

const recordsLinks: AdminLink[] = [
    { href: "/dashboard/academics/exam-results", icon: ClipboardCheck, title: "Exam Results", description: "Manage student exam results." },
    { href: "/dashboard/academics/student-records", icon: Users, title: "Student Records", description: "View student profiles." },
    { href: "/dashboard/disciplinary", icon: Gavel, title: "Disciplinary Records", description: "Log and track incidents." },
    { href: "/dashboard/counselling", icon: HeartHandshake, title: "Counselling Records", description: "Maintain confidential notes." },
];

const operationsLinks: AdminLink[] = [
    { href: "/dashboard/inventory", icon: Warehouse, title: "Primary Inventory", description: "Track fixed school assets." },
    { href: "/dashboard/inventory/summary", icon: BarChart3, title: "Primary Inventory Summary", description: "View asset value reports." },
    { href: "/dashboard/academics/classroom-inventory", icon: Boxes, title: "Classroom Inventory", description: "Manage classroom supplies." },
    { href: "/dashboard/academics/inventory-summary", icon: BarChart3, title: "Classroom Inventory Summary", description: "View classroom stock reports." },
    { href: "/dashboard/library", icon: Library, title: "Library Service", description: "Manage book loans and returns." },
    { href: "/dashboard/health-safety", icon: ShieldCheck, title: "Health & Safety", description: "Manage safety protocols and incidents." },
    { href: "/dashboard/reporting", icon: BarChart2, title: "Reporting Hub", description: "Generate all system reports." },
    { href: "/dashboard/summarization", icon: Bot, title: "AI Summarization", description: "Use AI to summarize documents." },
];


const AdminLinkItem = ({ link }: { link: AdminLink }) => {
  const Icon = link.icon;
  return (
    <Link href={link.href} className="block p-4 rounded-lg hover:bg-muted transition-colors group">
        <div className="flex items-start gap-4">
            <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="flex-grow">
                <p className="font-semibold text-foreground">{link.title}</p>
                <p className="text-sm text-muted-foreground">{link.description}</p>
            </div>
        </div>
    </Link>
  );
};

const Section = ({ title, links }: { title: string, links: AdminLink[] }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-headline font-bold text-primary">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {links.map(link => (
                <AdminLinkItem key={link.href} link={link} />
            ))}
        </div>
    </div>
);


export function PlatformManagementClient() {
  return (
    <div className="space-y-8">
        <PageHeader 
            title="Platform Management"
            description="The central hub for system administrators to manage all aspects of the application."
        />
        <Card className="shadow-lg">
            <CardContent className="p-6 space-y-8">
                <Section title="Platform & AI" links={platformAdminLinks} />
                <Separator />
                <Section title="School & User Management" links={schoolUserLinks} />
                <Separator />
                <Section title="Academics & Planning" links={academicsLinks} />
                <Separator />
                <Section title="Student & Staff Records" links={recordsLinks} />
                <Separator />
                <Section title="Operations, Safety & Reporting" links={operationsLinks} />
            </CardContent>
        </Card>
    </div>
  );
}
