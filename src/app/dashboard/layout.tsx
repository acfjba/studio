
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // This check replaces a real authentication provider for the prototype.
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      setIsAuthenticated(true);
    } else {
      router.push('/'); // Redirect to login if no role is found
    }
  }, [router]);
  
  if (!isAuthenticated) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background dark:bg-zinc-900">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
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
