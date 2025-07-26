
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    BarChart2, UserCog, Users, Building, DatabaseZap, Settings, Bot, History
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';

interface AdminLink {
    href: string;
    icon: React.ElementType;
    title: string;
    description: string;
}

const adminLinks: AdminLink[] = [
    {
        href: "/dashboard/reporting",
        icon: BarChart2,
        title: "Reporting",
        description: "Generate and view reports."
    },
    {
        href: "/dashboard/platform-management",
        icon: UserCog,
        title: "Platform Management",
        description: "Manage the entire platform."
    },
    {
        href: "/dashboard/user-management",
        icon: Users,
        title: "User Management",
        description: "Invite users and manage roles."
    },
    {
        href: "/dashboard/platform-management/school-management",
        icon: Building,
        title: "School Management",
        description: "View and manage schools."
    },
    {
        href: "/dashboard/platform-management/firebase-config",
        icon: DatabaseZap,
        title: "Firebase Config",
        description: "View Firebase status and manage data."
    },
    {
        href: "/dashboard/platform-management/app-settings",
        icon: Settings,
        title: "App Settings",
        description: "Configure system-wide settings."
    },
    {
        href: "/dashboard/platform-management/ai-assistant",
        icon: Bot,
        title: "AI Assistant",
        description: "Develop the app with AI."
    },
    {
        href: "/dashboard/history",
        icon: History,
        title: "Rating History",
        description: "Review your submitted ratings."
    },
    {
        href: "/dashboard/settings",
        icon: Settings,
        title: "Settings",
        description: "View application settings."
    },
];

const AdminLinkItem = ({ link }: { link: AdminLink }) => {
  const Icon = link.icon;

  return (
    <Link href={link.href} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors group">
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
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    {adminLinks.map(link => (
                        <AdminLinkItem key={link.href} link={link} />
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
