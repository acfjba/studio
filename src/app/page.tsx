
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, School } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the dashboard, bypassing login
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 relative font-body">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <School className="h-8 w-8 text-primary"/>
          <h1 className="text-xl font-headline font-bold text-foreground">School Data Insights</h1>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting to dashboard for design review...</p>
      </div>
    </div>
  );
}
