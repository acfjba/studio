
'use client';

import { Header } from "@/components/layout/header";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background dark:bg-zinc-900">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
