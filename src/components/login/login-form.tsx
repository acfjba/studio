
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import * as z from 'zod';
import usersSeedData from '@/data/users.json';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { isFirebaseConfigured } from '@/lib/firebase/config';

const SchoolLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  schoolId: z.string().min(1, { message: "School ID is required." }),
});

const AdminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('school');
  const { toast } = useToast();
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (schema: z.ZodSchema<any>, data: any) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isSchoolLogin = activeTab === 'school';
    const schema = isSchoolLogin ? SchoolLoginSchema : AdminLoginSchema;
    const data = isSchoolLogin ? { email, password, schoolId } : { email, password };
    
    if (!validate(schema, data)) {
      setIsLoading(false);
      return;
    }

    if (isFirebaseConfigured) {
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idTokenResult = await userCredential.user.getIdTokenResult();
            const claims = idTokenResult.claims;
            
            const userRole = claims.role as string;
            const userSchoolId = claims.schoolId as string | null;

            if (isSchoolLogin && userSchoolId !== schoolId) {
                toast({ variant: "destructive", title: "Login Failed", description: "School ID does not match this user account." });
                setIsLoading(false);
                return;
            }

            if (!isSchoolLogin && userRole !== 'system-admin') {
                toast({ variant: "destructive", title: "Access Denied", description: "This account does not have system admin privileges." });
                setIsLoading(false);
                return;
            }
            
            localStorage.setItem('userRole', userRole);
            if(userSchoolId) localStorage.setItem('schoolId', userSchoolId);
            
            toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });

            if(userRole === 'system-admin') router.push('/dashboard/platform-management');
            else router.push('/dashboard');
        } catch (error: any) {
            console.error("Firebase Auth Error:", error);
            toast({ variant: "destructive", title: "Login Failed", description: "Invalid credentials or user not found." });
        } finally {
            setIsLoading(false);
        }
    } else {
        // Fallback for demo mode
        const user = usersSeedData.find(u => u.email === email && u.password === password);
        
        if (!user) {
            toast({ variant: "destructive", title: "Login Failed", description: "Invalid credentials." });
            setIsLoading(false);
            return;
        }

        if (isSchoolLogin && user.schoolId !== schoolId) {
            toast({ variant: "destructive", title: "Login Failed", description: "School ID does not match." });
            setIsLoading(false);
            return;
        }

        if (!isSchoolLogin && user.role !== 'system-admin') {
            toast({ variant: "destructive", title: "Access Denied", description: "Not an admin account." });
            setIsLoading(false);
            return;
        }

        localStorage.setItem('userRole', user.role);
        if (user.schoolId) localStorage.setItem('schoolId', user.schoolId);

        toast({ title: "Login Successful (Demo)", description: "Redirecting to dashboard..." });
        if(user.role === 'system-admin') router.push('/dashboard/platform-management');
        else router.push('/dashboard');
        
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
              {errors.schoolId && <p className="text-sm text-destructive mt-1">{errors.schoolId}</p>}
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
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
