
'use client';

import { useRouter } from 'next/navigation';
import { HelpCircle, Key, School as SchoolIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';


export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    if (!isFirebaseConfigured || !db) {
        toast({ variant: "destructive", title: "Login Failed", description: "Firebase is not configured. Please contact support." });
        setIsLoggingIn(false);
        return;
    }
    
    try {
        const auth = getAuth();
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            throw new Error("User data not found in Firestore.");
        }

        const userData = userDocSnap.data();

        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('schoolId', userData.schoolId || '');
        toast({ title: "Login Successful", description: `Welcome, ${userData.displayName}!` });
        
        if (userData.role === 'system-admin') {
            router.push('/dashboard/platform-management');
        } else {
            router.push('/dashboard');
        }
        
    } catch (error: any) {
        console.error("Firebase sign-in error:", error);
        let errorMessage = "Invalid email or password.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.message === "User data not found in Firestore.") {
            errorMessage = "Authentication succeeded, but user role could not be verified. Please contact an admin.";
        }
        toast({ variant: "destructive", title: "Login Failed", description: errorMessage });
        setIsLoggingIn(false);
    }
  };


  const InfoTooltip = ({ text }: { text: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="flex items-center" onMouseDown={(e) => e.preventDefault()}>
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-primary/20 shadow-2xl">
      <CardHeader className="items-center text-center">
        <div className="mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-primary/10">
            <SchoolIcon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-primary">Platform Login</CardTitle>
        <CardDescription>Enter your official credentials to access the dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="school-email" className="flex items-center gap-2">Email Address <InfoTooltip text="Use your official school-provided email address." /></Label>
                <Input id="school-email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="border-primary/50 focus-visible:ring-primary" disabled={isLoggingIn} />
              </div>

              <div className="grid gap-2">
                 <Label htmlFor="school-password" className="flex items-center gap-2">Password <InfoTooltip text="Enter your password." /></Label>
                <Input id="school-password" type="password" required placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} className="border-primary/50 focus-visible:ring-primary" disabled={isLoggingIn} />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <div className="mt-4 text-center text-xs text-muted-foreground">
                <p>System Admins should use their assigned global credentials.</p>
                <p>All other users should use their school-specific credentials.</p>
            </div>
      </CardContent>
    </Card>
  );
}
