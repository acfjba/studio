
"use client";

import React from 'react';
import Link from 'next/link';
import { 
    BarChart2, UserCog, Building, DatabaseZap, Settings, Mail,
    History, Wifi, Box, Bot
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminLink {
    href: string;
    icon: React.ElementType;
    title: string;
    description: string;
}

const managementLinks: AdminLink[] = [
    { href: "/dashboard/reporting", icon: BarChart2, title: "Reporting", description: "Generate and view reports." },
    { href: "/dashboard/platform-management", icon: UserCog, title: "Platform Management", description: "Manage the entire platform." },
    { href: "/dashboard/invite-teachers", icon: UserCog, title: "User Management", description: "Invite users and manage roles." },
    { href: "/dashboard/platform-management/school-management", icon: Building, title: "School Management", description: "View and manage schools." },
    { href: "/dashboard/platform-management/firebase-config", icon: DatabaseZap, title: "Firebase Config", description: "View Firebase status and manage data." },
    { href: "/dashboard/platform-management/app-settings", icon: Settings, title: "App Settings", description: "Configure system-wide settings." },
    { href: "/dashboard/platform-management/ai-assistant", icon: Bot, title: "AI Assistant", description: "Develop the app with AI." },
    { href: "/dashboard/history", icon: History, title: "Rating History", description: "Review your submitted ratings." },
    { href: "/dashboard/settings", icon: Settings, title: "Settings", description: "View application settings." },
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

export function PlatformManagementClient() {
  return (
    <div className="space-y-8">
        <PageHeader 
            title="Platform Management"
            description="The central hub for system administrators to manage all aspects of the application."
        />
        <Card className="shadow-lg">
            <CardContent className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {managementLinks.map(link => (
                        <AdminLinkItem key={link.href} link={link} />
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
