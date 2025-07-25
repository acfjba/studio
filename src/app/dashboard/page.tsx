
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import Link from 'next/link';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
    setIsLoading(false);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const roleBasedLinks = {
    'system-admin': [
        { path: '/dashboard/platform-management', title: 'Platform Management', description: 'Oversee the entire platform, schools, and users.' },
    ],
    'primary-admin': [
        { path: '/dashboard/primary-admin', title: 'Primary Admin Dashboard', description: 'Manage all school operations and academic records.' },
    ],
    'head-teacher': [
        { path: '/dashboard/head-teacher', title: 'Head Teacher Dashboard', description: 'Review teacher submissions and manage school tasks.' },
    ],
    'assistant-head-teacher': [
        { path: '/dashboard/head-teacher', title: 'Head Teacher Dashboard', description: 'Review teacher submissions and manage school tasks.' },
    ],
    'teacher': [
        { path: '/dashboard/teacher-panel', title: 'Teacher Panel', description: 'Access your planning, records, and reporting tools.' },
    ],
    'kindergarten': [
        { path: '/dashboard/teacher-panel', title: 'Teacher Panel', description: 'Access your planning, records, and reporting tools.' },
    ],
    'librarian': [
        { path: '/dashboard/library', title: 'Library Service', description: 'Manage the book catalogue, loans, and returns.' },
    ]
  };

  const availableLinks = userRole ? roleBasedLinks[userRole as keyof typeof roleBasedLinks] : [];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Welcome to your Dashboard"
        description="Select an option below to get started."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableLinks && availableLinks.length > 0 ? (
          availableLinks.map(link => (
            <Card key={link.path}>
                <CardHeader>
                    <CardTitle>{link.title}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => handleNavigation(link.path)} className="w-full">
                        Go to {link.title}
                    </Button>
                </CardContent>
            </Card>
          ))
        ) : (
           <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>No Dashboard Available</CardTitle>
                    <CardDescription>Your user role does not have a specific dashboard assigned. You can access features from the top navigation menu.</CardDescription>
                </CardHeader>
                 <CardContent>
                   <Link href="/dashboard/profile">
                    <Button variant="outline">View My Profile</Button>
                   </Link>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
