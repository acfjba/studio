'use client';

import { useRouter } from 'next/navigation';
import { School } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LoginForm() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle authentication here.
    // For this demo, we'll just redirect to the dashboard.
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <School className="h-8 w-8 text-primary" />
          School Data Insights
        </CardTitle>
        <CardDescription>Select your login method and enter your credentials.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="school" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="school">School</TabsTrigger>
            <TabsTrigger value="admin">System Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="school">
            <form onSubmit={handleLogin} className="grid gap-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="school-id">School ID</Label>
                <Input id="school-id" placeholder="Enter your school ID" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-email">Email</Label>
                <Input id="school-email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-password">Password</Label>
                <Input id="school-password" type="password" required />
              </div>
              <Button type="submit" className="w-full mt-2">
                Login
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="admin">
            <form onSubmit={handleLogin} className="grid gap-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" placeholder="admin@system.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input id="admin-password" type="password" required />
              </div>
              <Button type="submit" className="w-full mt-2">
                Login
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
