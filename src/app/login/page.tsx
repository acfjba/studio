
"use client";

import { LoginForm } from '@/components/login/login-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { School } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 relative font-body">
       <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <School className="h-8 w-8 text-primary"/>
          <h1 className="text-xl font-headline font-bold text-foreground">School Data Insights</h1>
        </div>
        <Link href="/presentation">
          <Button variant="outline">View Presentation</Button>
        </Link>
      </div>
      <LoginForm />
    </div>
  );
}
