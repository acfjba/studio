
'use client';

import { Header } from "@/components/layout/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only run this check if Firebase is configured.
    if (!isFirebaseConfigured) {
      // If not configured, we might be in a dev/demo mode.
      // We can check local storage as a fallback for the demo.
      const role = localStorage.getItem('userRole');
      if (!role) {
        router.push('/login');
      } else {
        setIsAuthLoaded(true);
      }
      return;
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in and authenticated.
        setIsAuthLoaded(true);
      } else {
        // User is signed out.
        // Also check localStorage as a fallback for the demo login system.
        const role = localStorage.getItem('userRole');
        if (!role) {
            router.push('/login');
        } else {
            // This allows the demo login to work without real Firebase Auth sign-in
            setIsAuthLoaded(true);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (!isAuthLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying authentication...</p>
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
