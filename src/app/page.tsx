
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('systemadmin@system.com');
  const [password, setPassword] = useState('admin12345');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        // In a real app, you'd call Firebase auth here.
        // For this design-focused prototype, we'll simulate a successful login.
        console.log(`Attempting login for ${email}`);
        
        // This simulates a successful login for the system admin
        if (email === 'systemadmin@system.com' && password === 'admin12345') {
            localStorage.setItem('userRole', 'system-admin');
            localStorage.setItem('schoolId', 'SCH-001'); // Default for admin
            toast({
                title: "Login Successful",
                description: "Redirecting to your dashboard...",
            });
            router.push('/dashboard');
        } else {
             toast({
                variant: 'destructive',
                title: "Login Failed",
                description: "Invalid credentials for prototype mode.",
            });
             setIsLoading(false);
        }
    }, 1000);
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
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                 <a href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ArrowRight className="mr-2 h-4 w-4" />}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
