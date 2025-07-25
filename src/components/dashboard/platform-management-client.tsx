
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    BarChart2, UserCog, Users, Building, Database, Settings, Bot, History, ArrowRight
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
        href: "/dashboard/invite-teachers",
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
        icon: Database,
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
    }
];

const AdminCard = ({ link }: { link: AdminLink }) => {
  const Icon = link.icon;
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
            <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
                <CardTitle className="font-headline text-lg">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={link.href}>
          <Button variant="outline" className="w-full">
            Go to {link.title}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export function PlatformManagementClient() {
  return (
    <div className="space-y-8">
        <PageHeader 
            title="Platform Management"
            description="Manage the entire platform, from schools and users to system settings and data."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminLinks.map(link => (
                <AdminCard key={link.href} link={link} />
            ))}
             <Card className="shadow-md hover:shadow-lg transition-shadow bg-primary text-primary-foreground">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <UserCog className="h-6 w-6 flex-shrink-0 mt-1" />
                        <div>
                            <CardTitle className="font-headline text-lg">Platform Management</CardTitle>
                            <CardDescription className="text-primary-foreground/80">Manage the entire platform.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* This is the current page, so no link is needed */}
                    <Button variant="secondary" className="w-full" disabled>Currently Viewing</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
