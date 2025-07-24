
'use client';

import { Header } from "@/components/layout/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role) {
      router.push('/login');
    } else {
      setIsAuthLoaded(true);
    }
  }, [router]);

  if (!isAuthLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background dark:bg-zinc-900">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
