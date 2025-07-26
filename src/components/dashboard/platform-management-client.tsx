
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    BarChart2, UserCog, Users, Building, DatabaseZap, Settings, Bot, History,
    GraduationCap, BookOpen, Warehouse, Library, ShieldCheck, Contact, FileText,
    HeartHandshake, Gavel
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Separator } from '@/components/ui/separator';

interface AdminLink {
    href: string;
    icon: React.ElementType;
    title: string;
    description: string;
}

const platformAdminLinks: AdminLink[] = [
    {
        href: "/dashboard/platform-management/school-management",
        icon: Building,
        title: "School Management",
        description: "View, edit, and create new schools."
    },
     {
        href: "/dashboard/user-management",
        icon: Users,
        title: "User Management",
        description: "Invite new users and manage roles."
    },
    {
        href: "/dashboard/platform-management/firebase-config",
        icon: DatabaseZap,
        title: "Firebase & Data",
        description: "Seed data and monitor connections."
    },
    {
        href: "/dashboard/platform-management/app-settings",
        icon: Settings,
        title: "App Settings",
        description: "Configure system-wide features & theme."
    },
    {
        href: "/dashboard/platform-management/ai-assistant",
        icon: Bot,
        title: "AI Assistant",
        description: "Develop and manage the app with AI."
    },
];

const schoolDataLinks: AdminLink[] = [
    { href: '/dashboard/academics', icon: GraduationCap, title: 'Academics Hub', description: 'Manage lesson plans & inventory.' },
    { href: '/dashboard/counselling', icon: HeartHandshake, label: 'Counselling', description: 'Manage confidential records.' },
    { href: '/dashboard/disciplinary', icon: Gavel, label: 'Disciplinary', description: 'Manage disciplinary records.' },
    { href: '/dashboard/inventory', icon: Warehouse, label: 'Primary Inventory', description: 'Track and forecast school assets.' },
    { href: '/dashboard/library', icon: Library, label: 'Library Service', description: 'Manage book loans and returns.' },
    { href: '/dashboard/health-safety', icon: ShieldCheck, label: 'Health & Safety', description: 'Manage safety protocols.' },
    { href: '/dashboard/staff', icon: Users, label: 'Staff Records', description: 'Manage all staff information.' },
    { href: '/dashboard/contacts', icon: Contact, label: 'Contacts', description: 'View staff directory.' },
    { href: '/dashboard/document-vault', icon: FileText, label: 'Document Vault', description: 'Access your saved documents.'},
    { href: '/dashboard/reporting', icon: BarChart2, title: 'Reporting & Analytics', description: 'Generate custom reports and view KPIs.' },
    { href: '/dashboard/history', icon: History, title: 'My Rating History', description: 'Review your submitted ratings.' },
];


const AdminLinkItem = ({ link }: { link: AdminLink }) => {
  const Icon = link.icon;

  return (
    <Link href={link.href} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
        <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
        <div className="flex-grow">
            <p className="font-semibold text-foreground">{link.title}</p>
            <p className="text-sm text-muted-foreground">{link.description}</p>
        </div>
    </Link>
  );
};

export function PlatformManagementClient() {
  return (
    <div className="space-y-8">
        <PageHeader 
            title="Platform Management"
            description="Manage the entire platform, from schools and users to system settings and data."
        />
        <Card className="shadow-lg">
            <CardContent className="p-6 space-y-8">
                <div>
                    <h3 className="text-xl font-headline font-bold text-primary mb-4">Platform & User Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {platformAdminLinks.map(link => (
                            <AdminLinkItem key={link.href} link={link} />
                        ))}
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="text-xl font-headline font-bold text-primary mb-4">School Operations & Data</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {schoolDataLinks.map(link => (
                            <AdminLinkItem key={link.href} link={link} />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
