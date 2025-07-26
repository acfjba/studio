
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, School } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from '@/lib/firebase/config';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('school');
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isFirebaseConfigured) {
        toast({
            variant: "destructive",
            title: "Firebase Not Configured",
            description: "The Firebase connection is not available. Please check the environment variables.",
        });
        setIsLoading(false);
        return;
    }

    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Email and password cannot be empty.",
        });
        setIsLoading(false);
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Success. Now, get claims and redirect.
        const idTokenResult = await userCredential.user.getIdTokenResult(true);
        const claims = idTokenResult.claims;
        const userRole = claims.role as string;
        const userSchoolId = claims.schoolId as string | null;

        // Post-login validation
        if (activeTab === 'school' && userRole !== 'system-admin' && (!userSchoolId || userSchoolId !== schoolId)) {
            toast({ variant: "destructive", title: "Login Failed", description: "The School ID does not match this user account." });
            setIsLoading(false);
            return;
        }

        if (activeTab === 'admin' && userRole !== 'system-admin') {
            toast({ variant: "destructive", title: "Access Denied", description: "This account does not have System Admin privileges." });
            setIsLoading(false);
            return;
        }

        // Store role and school ID for the session
        localStorage.setItem('userRole', userRole);
        if(userSchoolId) {
          localStorage.setItem('schoolId', userSchoolId);
        } else {
          localStorage.removeItem('schoolId');
        }
        
        toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });

        router.push('/dashboard');
      })
      .catch((error) => {
        // Handle Errors here.
        console.error("Login failed:", error.message);
        let errorMessage = "An unknown error occurred.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-api-key') {
            errorMessage = "The email, password, or API key is incorrect.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Please enter a valid email address.";
        }
        toast({ variant: "destructive", title: "Login Failed", description: errorMessage });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
      
       <Card className="w-full max-w-md shadow-2xl">
      <div className="p-4">
        <div className="flex w-full">
          <button
            onClick={() => setActiveTab('school')}
            className={`w-1/2 p-2 text-center rounded-l-md transition-colors ${
              activeTab === 'school' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            School Login
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`w-1/2 p-2 text-center rounded-r-md transition-colors ${
              activeTab === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            Admin Login
          </button>
        </div>
      </div>
      <form onSubmit={handleLogin}>
        <CardHeader>
          <CardTitle>{activeTab === 'school' ? 'School Login' : 'Admin Login'}</CardTitle>
          <CardDescription>Enter your credentials to access the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {activeTab === 'school' && (
            <div>
              <Label htmlFor="schoolId">School ID</Label>
              <Input id="schoolId" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} placeholder="Enter School ID" />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" required/>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required/>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseConfigured}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
           {!isFirebaseConfigured && (
              <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Firebase Not Configured</AlertTitle>
                  <AlertDescription>
                      The application cannot connect to Firebase. The form is disabled.
                  </AlertDescription>
              </Alert>
           )}
        </CardContent>
      </form>
    </Card>
    </div>
  );
}
