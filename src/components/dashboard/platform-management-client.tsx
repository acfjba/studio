
"use client";

import React from 'react';
import Link from 'next/link';
import { 
    BarChart2, UserCog, Users, Building, DatabaseZap, Settings, Bot, History, Settings2,
    GraduationCap, Warehouse, ShieldCheck, Contact, FileText, Mail, BookOpen
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
    { href: "/dashboard/email", icon: Mail, title: "Bulk Email", description: "Send an email to all users." },
    { href: "/dashboard/teachers", icon: Users, title: "Rating History", description: "Review your submitted ratings." },
    { href: "/dashboard/settings", icon: Settings2, title: "Settings", description: "View application settings." },
];

const schoolUserLinks: AdminLink[] = [
    { href: "/dashboard/platform-management/school-management", icon: Building, title: "School Management", description: "View and manage all schools." },
    { href: "/dashboard/user-management", icon: Users, title: "User Management", description: "Invite users and manage roles." },
    { href: "/dashboard/staff", icon: UserCog, title: "Staff Records", description: "Manage staff information." },
];

const dataReportingLinks: AdminLink[] = [
    { href: "/dashboard/reporting", icon: BarChart2, title: "Reporting Hub", description: "Generate all system reports." },
    { href: "/dashboard/upload-data", icon: DatabaseZap, title: "Upload Data", description: "Bulk upload data from files." },
    { href: "/dashboard/document-vault", icon: FileText, title: "Document Vault", description: "Access all saved documents." },
];

const operationsLinks: AdminLink[] = [
    { href: "/dashboard/inventory", icon: Warehouse, title: "Inventory Management", description: "Track and forecast school assets." },
    { href: "/dashboard/health-safety", icon: ShieldCheck, title: "Health & Safety", description: "Manage safety protocols." },
    { href: "/dashboard/contacts", icon: Contact, title: "Contacts Directory", description: "View all school contacts." },
];

const academicsLinks: AdminLink[] = [
     { href: "/dashboard/academics", icon: GraduationCap, title: "Academics Hub", description: "Central point for academic management." },
     { href: "/dashboard/workbook-plan", icon: BookOpen, title: "Workbook Plans", description: "Review and manage workbook plans." },
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
                <Section title="Platform Administration" links={platformAdminLinks} />
                <Separator />
                <Section title="School & User Management" links={schoolUserLinks} />
                <Separator />
                <Section title="Data & Reporting" links={dataReportingLinks} />
                <Separator />
                <Section title="School Operations" links={operationsLinks} />
                 <Separator />
                <Section title="Academics" links={academicsLinks} />
            </CardContent>
        </Card>
    </div>
  );
}
