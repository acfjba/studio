
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/firebase/config';

export function LoginForm() {
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

    const isSchoolLogin = activeTab === 'school';

    if (isSchoolLogin && !schoolId) {
      toast({ variant: "destructive", title: "Login Failed", description: "School ID is required for School Login." });
      setIsLoading(false);
      return;
    }

    try {
      // Use the standard Firebase Auth method as you provided
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // After successful login, get custom claims to determine role and school
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const claims = idTokenResult.claims;
      
      const userRole = claims.role as string;
      const userSchoolId = claims.schoolId as string | null;

      // Validate credentials based on the selected tab
      if (isSchoolLogin) {
          if (!userSchoolId || userSchoolId !== schoolId) {
              toast({ variant: "destructive", title: "Login Failed", description: "The School ID does not match this user account." });
              setIsLoading(false);
              return;
          }
      } else { // Admin Login
          if (userRole !== 'system-admin') {
              toast({ variant: "destructive", title: "Access Denied", description: "This account does not have System Admin privileges." });
              setIsLoading(false);
              return;
          }
      }
      
      // Store role and school ID for the session
      localStorage.setItem('userRole', userRole);
      if(userSchoolId) {
        localStorage.setItem('schoolId', userSchoolId);
      } else {
        localStorage.removeItem('schoolId');
      }
      
      toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });

      // Redirect based on role
      switch (userRole) {
          case 'system-admin':
              router.push('/dashboard/platform-management');
              break;
          case 'primary-admin':
              router.push('/dashboard/primary-admin');
              break;
          case 'head-teacher':
          case 'assistant-head-teacher':
              router.push('/dashboard/head-teacher');
              break;
          case 'teacher':
          case 'kindergarten':
              router.push('/dashboard/teacher-panel');
              break;
          default:
              router.push('/dashboard');
              break;
      }

    } catch (error: any) {
        console.error("Login failed:", error.message);
        let errorMessage = "Invalid credentials or user not found.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-password') {
            errorMessage = "The email or password you entered is incorrect.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Please enter a valid email address.";
        }
        toast({ variant: "destructive", title: "Login Failed", description: errorMessage });
    } finally {
        setIsLoading(false);
    }
  };

  return (
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
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
