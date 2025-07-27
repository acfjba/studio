
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, School } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically set the role to system-admin for bypass
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', 'system-admin');
      localStorage.setItem('schoolId', 'global');
    }
    // Redirect to the main system admin dashboard
    router.replace('/dashboard/platform-management');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 font-body">
        <div className="flex items-center gap-3 mb-4">
          <School className="h-10 w-10 text-primary"/>
          <h1 className="text-2xl font-headline font-bold text-foreground">School Data Insights</h1>
        </div>
        <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Redirecting to the application...</p>
        </div>
    </div>
  );
}
