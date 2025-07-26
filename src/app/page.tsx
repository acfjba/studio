
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, ArrowRight, Loader2, KeyRound, Building, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { auth, db, isFirebaseConfigured } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  // State for School Login
  const [schoolId, setSchoolId] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [schoolPassword, setSchoolPassword] = useState('');
  
  // State for Admin Login
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>, loginType: 'school' | 'admin') => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Firebase is not configured.' });
        return;
    }

    setIsLoading(true);
    
    const email = loginType === 'school' ? schoolEmail : adminEmail;
    const password = loginType === 'school' ? schoolPassword : adminPassword;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            throw new Error("User profile not found in database.");
        }

        const userData = userDocSnap.data();
        
        // Role and School ID validation
        if (loginType === 'school') {
            if (userData.schoolId !== schoolId) {
                throw new Error("School ID does not match your user profile.");
            }
        } else { // Admin login
            if (userData.role !== 'system-admin') {
                throw new Error("You do not have System Admin privileges.");
            }
        }
        
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('schoolId', userData.schoolId);

        toast({
            title: "Login Successful",
            description: "Redirecting to your dashboard...",
        });
        router.push('/dashboard');

    } catch (error: any) {
        let errorMessage = "An unknown error occurred.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = "Invalid email or password. Please try again.";
        } else {
            errorMessage = error.message;
        }
        toast({
            variant: 'destructive',
            title: "Login Failed",
            description: errorMessage,
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
        toast({ variant: 'destructive', title: 'Email Required', description: 'Please enter your email address to reset your password.' });
        return;
    }
    if (!isFirebaseConfigured) {
        toast({ variant: 'destructive', title: 'Action Failed', description: 'Firebase is not configured.' });
        return;
    }
    try {
        await sendPasswordResetEmail(auth, resetEmail);
        toast({
            title: 'Password Reset Email Sent',
            description: `If an account exists for ${resetEmail}, you will receive a password reset link.`,
        });
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Password Reset Failed',
            description: error.message,
        });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 font-body">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <School className="h-8 w-8 text-primary"/>
          <h1 className="text-xl font-headline font-bold text-foreground">School Data Insights</h1>
        </div>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl">
        <Tabs defaultValue="school" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="school">School Login</TabsTrigger>
            <TabsTrigger value="admin">System Admin</TabsTrigger>
          </TabsList>
          
          {/* School Login Tab */}
          <TabsContent value="school">
            <form onSubmit={(e) => handleLogin(e, 'school')}>
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">School Portal</CardTitle>
                <CardDescription>Login with your school-provided credentials.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="schoolId"><Building className="inline-block mr-2 h-4 w-4" />School ID</Label>
                  <Input
                    id="schoolId"
                    type="text"
                    placeholder="Enter your school ID"
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school-email"><Mail className="inline-block mr-2 h-4 w-4" />Email</Label>
                  <Input
                    id="school-email"
                    type="email"
                    placeholder="m@example.com"
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school-password"><KeyRound className="inline-block mr-2 h-4 w-4" />Password</Label>
                  <Input 
                    id="school-password" 
                    type="password"
                    value={schoolPassword}
                    onChange={(e) => setSchoolPassword(e.target.value)}
                    required 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ArrowRight className="mr-2 h-4 w-4" />}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          {/* System Admin Login Tab */}
          <TabsContent value="admin">
            <form onSubmit={(e) => handleLogin(e, 'admin')}>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">System Admin Portal</CardTitle>
                    <CardDescription>Enter your administrator credentials.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="admin-email"><Mail className="inline-block mr-2 h-4 w-4" />Email</Label>
                        <Input
                            id="admin-email"
                            type="email"
                            placeholder="admin@system.com"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="admin-password"><KeyRound className="inline-block mr-2 h-4 w-4" />Password</Label>
                        <Input 
                            id="admin-password" 
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required 
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ArrowRight className="mr-2 h-4 w-4" />}
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="p-6 pt-0 text-center">
          <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Button variant="link" className="text-sm font-medium">Forgot password?</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Reset Password</AlertDialogTitle>
                      <AlertDialogDescription>
                          Enter your email address below. If an account exists, we will send you a link to reset your password.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid gap-2">
                      <Label htmlFor="reset-email">Email Address</Label>
                      <Input
                          id="reset-email"
                          type="email"
                          placeholder="you@example.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                      />
                  </div>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handlePasswordReset}>Send Reset Link</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
}
