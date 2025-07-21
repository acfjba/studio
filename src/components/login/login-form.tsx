
'use client';

import { useRouter } from 'next/navigation';
import { HelpCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { usersSeedData } from '@/lib/seed-data';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [schoolId, setSchoolId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');


  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const user = usersSeedData.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.schoolId === schoolId
    );

    // Note: Plain text password check is for demo purposes ONLY.
    // In a real application, you would send the password to a backend
    // to be compared against a securely hashed version.
    if (user && user.password === password) {
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('schoolId', user.schoolId || '');
      toast({ title: "Login Successful", description: `Welcome, ${user.displayName}!` });
      router.push('/dashboard');
    } else {
      toast({ variant: "destructive", title: "Login Failed", description: "Invalid school ID, email, or password." });
    }
  };

  const handleAdminLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const adminUser = usersSeedData.find(
      u => u.email.toLowerCase() === adminEmail.toLowerCase() && (u.role === 'system-admin' || u.role === 'superadmin')
    );
    
    if (adminUser && adminUser.password === adminPassword) {
      localStorage.setItem('userRole', adminUser.role);
      localStorage.setItem('schoolId', ''); // System admins don't have a school ID
      toast({ title: "Admin Login Successful", description: `Welcome, ${adminUser.displayName}!` });
      router.push('/dashboard/platform-management');
    } else {
       toast({ variant: "destructive", title: "Login Failed", description: "Invalid admin email or password." });
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
                <Input id="school-id" placeholder="e.g. SCH-001" required value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="border-primary/50 focus-visible:ring-primary" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="school-email" className="flex items-center gap-2">Email Address <InfoTooltip text="Use your official school-provided email address." /></Label>
                <Input id="school-email" type="email" placeholder="you@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="border-primary/50 focus-visible:ring-primary"/>
              </div>

              <Alert variant="destructive" className="border-l-4 border-destructive bg-destructive/10 text-destructive-foreground">
                <AlertDescription>
                    <strong>Note:</strong> Use your personal email (not generic school) as registered. Contact your school admin if you cannot log in.
                </AlertDescription>
              </Alert>

              <div className="grid gap-2">
                 <Label htmlFor="school-password" className="flex items-center gap-2">Password <InfoTooltip text="Enter your password." /></Label>
                <Input id="school-password" type="password" required placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} className="border-primary/50 focus-visible:ring-primary"/>
              </div>

              <Button type="submit" className="w-full mt-4">
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="admin">
            <form onSubmit={handleAdminLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-email" className="flex items-center gap-2">Email Address <InfoTooltip text="System administrator email address." /></Label>
                <Input id="admin-email" type="email" placeholder="admin@system.com" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="border-primary/50 focus-visible:ring-primary"/>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="admin-password" className="flex items-center gap-2">Password <InfoTooltip text="System administrator password." /></Label>
                <Input id="admin-password" type="password" required placeholder="******" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="border-primary/50 focus-visible:ring-primary"/>
              </div>

              <Button type="submit" className="w-full mt-4">
                Login
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
