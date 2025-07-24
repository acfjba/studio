
'use client';

import { useRouter } from 'next/navigation';
import { HelpCircle, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';


export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [schoolId, setSchoolId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');


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
        if(userData.schoolId !== schoolId) {
            toast({ variant: "destructive", title: "Login Failed", description: "The provided School ID does not match this user's record." });
            auth.signOut();
            setIsLoggingIn(false);
            return;
        }

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

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
            throw new Error("User data not found in Firestore.");
        }

        const userData = userDocSnap.data();
        const isAdminRole = userData.role === 'system-admin';

        if (!isAdminRole) {
            toast({ variant: "destructive", title: "Login Failed", description: "This account does not have admin privileges." });
            auth.signOut();
            setIsLoggingIn(false);
            return;
        }

        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('schoolId', ''); // System admins don't have a school ID
        toast({ title: "Admin Login Successful", description: `Welcome, ${userData.displayName}!` });
        router.push('/dashboard/platform-management');
    } catch (error) {
       console.error("Firebase admin sign-in error:", error);
       toast({ variant: "destructive", title: "Login Failed", description: "Invalid admin email or password." });
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
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-gray-200">
                 <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
          <h1 className="text-2xl font-bold text-primary">TRA Platform Login</h1>
          <p className="text-muted-foreground">Choose your login type and sign in with your details.</p>
        </div>

        <Tabs defaultValue="school" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted p-1 mb-6">
            <TabsTrigger value="school">School Login</TabsTrigger>
            <TabsTrigger value="admin">System Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="school">
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="school-id" className="flex items-center gap-2">School ID <InfoTooltip text="Enter the official ID provided to your school." /></Label>
                <Input id="school-id" placeholder="e.g. 3046" required value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="border-primary/50 focus-visible:ring-primary" disabled={isLoggingIn} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="school-email" className="flex items-center gap-2">Email Address <InfoTooltip text="Use your official school-provided email address." /></Label>
                <Input id="school-email" type="email" placeholder="you@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="border-primary/50 focus-visible:ring-primary" disabled={isLoggingIn} />
              </div>

              <div className="grid gap-2">
                 <Label htmlFor="school-password" className="flex items-center gap-2">Password <InfoTooltip text="Enter your password." /></Label>
                <Input id="school-password" type="password" required placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} className="border-primary/50 focus-visible:ring-primary" disabled={isLoggingIn} />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="admin">
            <form onSubmit={handleAdminLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-email" className="flex items-center gap-2">Email Address <InfoTooltip text="System administrator email address." /></Label>
                <Input id="admin-email" type="email" placeholder="admin@system.com" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="border-primary/50 focus-visible:ring-primary" disabled={isLoggingIn} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="admin-password" className="flex items-center gap-2">Password <InfoTooltip text="System administrator password." /></Label>
                <Input id="admin-password" type="password" required placeholder="******" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="border-primary/50 focus-visible:ring-primary" disabled={isLoggingIn} />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
