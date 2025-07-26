
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
    // We can assume localStorage is populated by the time this page loads
    // because of the check in DashboardLayout.
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
      
      // Auto-redirect to role-specific dashboard if it's not a generic role
      const roleSpecificPaths: { [key: string]: string } = {
        'system-admin': '/dashboard/platform-management',
        'primary-admin': '/dashboard/primary-admin',
        'head-teacher': '/dashboard/head-teacher',
        'assistant-head-teacher': '/dashboard/head-teacher',
        'teacher': '/dashboard/teacher-panel',
        'kindergarten': '/dashboard/teacher-panel',
        'librarian': '/dashboard/library',
      };
      
      if (roleSpecificPaths[role]) {
        router.replace(roleSpecificPaths[role]);
      } else {
        setIsLoading(false);
      }
    } else {
      // If for some reason role is not found, stay on this page to show a message
      setIsLoading(false);
    }
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Welcome to your Dashboard"
        description="Select an option below to get started or use the navigation menu."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!userRole ? (
           <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>No Dashboard Available</CardTitle>
                    <CardDescription>Your user role could not be determined. You can access features from the top navigation menu or go to your profile.</CardDescription>
                </CardHeader>
                 <CardContent>
                   <Link href="/dashboard/profile">
                    <Button variant="outline">View My Profile</Button>
                   </Link>
                </CardContent>
            </Card>
        ) : (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Redirecting...</CardTitle>
                    <CardDescription>If you are not redirected, please use the navigation menu above or go to your profile.</CardDescription>
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
