
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const TopNavLink = ({ children }: { children: React.ReactNode }) => (
  <button className="px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 rounded-md">
    {children}
  </button>
);

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('school');
  const [schoolId, setSchoolId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleSchoolLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is where you would put your real login logic
    toast({
      title: "Login Simulated",
      description: `Attempting login for School ID: ${schoolId} with user: ${username}`,
    });
    // On successful login, you would redirect
    // For demo purposes, let's assume login is successful and set a role
    if (username.includes('teacher')) {
        localStorage.setItem('userRole', 'teacher');
    } else if (username.includes('head')) {
        localStorage.setItem('userRole', 'head-teacher');
    }
    localStorage.setItem('schoolId', schoolId);
    router.push('/dashboard');
  };
  
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Admin Login Simulated",
      description: `Attempting admin login for user: ${adminUsername}`,
    });
     if (adminUsername === 'sysadmin@system.com') {
        localStorage.setItem('userRole', 'system-admin');
        localStorage.removeItem('schoolId');
        router.push('/dashboard/platform-management');
     } else {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid admin credentials.',
        });
     }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-red-800 shadow-md">
        <div className="container mx-auto px-4 py-2">
          <h1 className="text-xl font-bold text-white">TRA – Teacher Rating App</h1>
        </div>
      </header>
      <nav className="bg-gradient-to-r from-red-700 via-yellow-600 to-red-700">
        <div className="container mx-auto px-4 flex justify-start space-x-1">
          <TopNavLink>School Records</TopNavLink>
          <TopNavLink>Communication & Registration</TopNavLink>
          <TopNavLink>Departments & Reports</TopNavLink>
          <TopNavLink>Exams & Reports</TopNavLink>
          <TopNavLink>Utility</TopNavLink>
          <TopNavLink>Login</TopNavLink>
        </div>
      </nav>
      <main className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl">
            <Tabs defaultValue="school" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="school">School Login</TabsTrigger>
                    <TabsTrigger value="admin">Admin Login</TabsTrigger>
                </TabsList>
                <TabsContent value="school">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-yellow-600">School Login</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSchoolLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="schoolId">School ID</Label>
                        <Input id="schoolId" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} placeholder="Enter School ID" required />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" required />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                      </div>
                      <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Login</Button>
                    </form>
                  </CardContent>
                </TabsContent>
                <TabsContent value="admin">
                   <CardHeader>
                    <CardTitle className="text-2xl font-bold text-yellow-600">Admin Login</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="adminUsername">Username</Label>
                        <Input id="adminUsername" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} placeholder="Enter your username" required />
                      </div>
                      <div>
                        <Label htmlFor="adminPassword">Password</Label>
                        <Input id="adminPassword" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Enter your password" required />
                      </div>
                      <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Login</Button>
                    </form>
                  </CardContent>
                </TabsContent>
            </Tabs>
        </Card>
      </main>
    </div>
  );
}
