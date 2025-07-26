
'use client';

import { Header } from "@/components/layout/header";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Simulate a system-admin login for design purposes
    // This removes the need for actual authentication.
    if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', 'system-admin');
        localStorage.setItem('schoolId', 'SCH-001'); // Provide a default schoolId for components that might need it
    }
  }, []);
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background dark:bg-zinc-900">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
