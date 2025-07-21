"use client";

import { LoginForm } from '@/components/login/login-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 relative">
       <div className="absolute top-4 right-4 z-10">
        <Link href="/presentation">
          <Button variant="outline">View Presentation</Button>
        </Link>
      </div>
      <LoginForm />
    </div>
  );
}
