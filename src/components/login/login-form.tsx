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
    <Card className="w-full max-w-md mx-auto">
       <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">
          Welcome to the Platform
        </CardTitle>
        <CardDescription>Empowering schools with a modern solution for performance and efficiency.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="school" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="school">School Login</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>
          <TabsContent value="school">
            <form onSubmit={handleLogin} className="grid gap-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="school-id">School ID</Label>
                <Input id="school-id" placeholder="Enter School ID (e.g., 3046)" required />
                 <p className="text-xs text-muted-foreground">
                    System Admins can leave School ID blank or enter one.
                  </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-email">Email</Label>
                <Input id="school-email" type="email" placeholder="Enter your email" required />
              </div>
              <div className="grid gap-2">
                 <div className="flex items-center">
                    <Label htmlFor="school-password">Password</Label>
                    <a href="#" className="ml-auto inline-block text-sm underline">
                        Forgot Password?
                    </a>
                </div>
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
                <div className="flex items-center">
                    <Label htmlFor="admin-password">Password</Label>
                    <a href="#" className="ml-auto inline-block text-sm underline">
                        Forgot Password?
                    </a>
                </div>
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
