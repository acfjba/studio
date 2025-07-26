
'use client';

import { Header } from "@/components/layout/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/config";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured) {
        // If firebase is not set up, enter a demo mode.
        // Try to load from localStorage for demo, but default if not present.
        if (!localStorage.getItem('userRole')) {
            localStorage.setItem('userRole', 'system-admin');
        }
        setIsAuthLoaded(true);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
            const idTokenResult = await user.getIdTokenResult(true); // Force refresh
            const claims = idTokenResult.claims;
            const userRole = claims.role as string;
            const userSchoolId = claims.schoolId as string | null;

            if (userRole) {
                localStorage.setItem('userRole', userRole);
            } else {
                localStorage.removeItem('userRole');
            }

            if (userSchoolId) {
                localStorage.setItem('schoolId', userSchoolId);
            } else {
                localStorage.removeItem('schoolId');
            }
            
            setIsAuthLoaded(true);

        } catch (error) {
            console.error("Error getting user claims:", error);
            // Handle error, maybe sign out user and redirect
            router.push('/');
        }
      } else {
        // User is signed out.
        router.push('/');
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
