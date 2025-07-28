
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
    ArrowRight, BookOpenText, CheckCircle, Home, Library, ShieldCheck, Star, UserCheck, Users, 
    BarChart3, Bell, FileText, UserCog, Settings2, DatabaseZap, GraduationCap, ClipboardList, 
    HeartHandshake, Gavel, Printer, Download, FileSpreadsheet,
    ShieldAlert, Boxes, Building2, Wand2, LogIn, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/schemas/user';

const Slide = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <section className={cn("h-screen w-full flex flex-col items-center justify-center p-8 snap-start", className)}>
        <Card className="w-full max-w-4xl bg-background/95 backdrop-blur-sm shadow-2xl overflow-hidden border-2 border-primary/20">
            <CardContent className="p-8 md:p-12">
                {children}
            </CardContent>
        </Card>
    </section>
);

const MOCK_USERS: { [key in Role]: { schoolId: string, email: string } } = {
    'system-admin': { schoolId: 'global', email: 'systemadmin@system.com' },
    'primary-admin': { schoolId: '2009', email: 'navolaudistrictschool@yahoo.com' },
    'head-teacher': { schoolId: '2009', email: 'rosabatina3@gmail.com' },
    'assistant-head-teacher': { schoolId: '2009', email: 'asst.head@example.com' },
    'teacher': { schoolId: '2009', email: 'lureqeleticia@gmail.com' },
    'kindergarten': { schoolId: '2009', email: 'kinder.teacher@example.com' },
    'librarian': { schoolId: '2009', email: 'librarian@example.com' },
};


export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role>('system-admin');
    const [email, setEmail] = useState(MOCK_USERS['system-admin'].email);

    const handleRoleChange = (role: Role) => {
        setSelectedRole(role);
        setEmail(MOCK_USERS[role].email);
    };
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const roleData = MOCK_USERS[selectedRole];
        if (roleData) {
            localStorage.setItem('userRole', selectedRole);
            localStorage.setItem('schoolId', roleData.schoolId);
        }
        
        toast({
            title: "Login Successful",
            description: `Logged in as ${selectedRole.replace('-', ' ')}. Redirecting...`,
        });

        // Redirect to the main system admin dashboard
        router.push('/dashboard');
    };
    
    return (
        <div className="font-body bg-muted/20">
             <nav className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-sm z-10 p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-7 w-7 text-primary"/>
                    <h1 className="text-xl font-headline font-bold text-foreground">School Data Insights</h1>
                </div>
                <Button onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    <LogIn className="mr-2 h-4 w-4" /> Go to Login
                </Button>
            </nav>
            <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
                <Slide>
                    <div className="text-center">
                        <h1 className="text-6xl font-headline font-bold text-primary mb-4">School Data Insights</h1>
                        <p className="text-2xl text-foreground">School Management for the Modern Era.</p>
                        <p className="text-muted-foreground mt-4">A Comprehensive, Data-Driven Solution for Fijian Schools</p>
                    </div>
                </Slide>
                
                 <Slide>
                    <h2 className="text-4xl font-headline font-bold text-accent mb-6 text-center">Core Features</h2>
                     <p className="text-lg text-foreground mb-8 text-center max-w-3xl mx-auto">An integrated platform that provides tools for every role, from teachers to system administrators, ensuring efficient data management and insightful analytics.</p>
                     <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-base">
                        <div className="flex items-start">
                            <BarChart3 className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Interactive Dashboards</p>
                                <p className="text-muted-foreground text-sm">Visualize key metrics with role-based dashboards. Monitor academic performance, inventory levels, and KPI reports in an intuitive, easy-to-understand format for data-driven decision making.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Advanced Search & Filtering</p>
                                <p className="text-muted-foreground text-sm">Quickly find the information you need with powerful search and filtering capabilities across all modules, including contacts, staff records, and inventory management.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <ShieldCheck className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Secure Access Control</p>
                                <p className="text-muted-foreground text-sm">Implement a secure, role-based access control system to ensure only authorized users can access sensitive data like API keys, counselling notes, and staff records, maintaining privacy and security.</p>
                            </div>
                        </div>
                         <div className="flex items-start">
                            <FileText className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Comprehensive Record-Keeping</p>
                                <p className="text-muted-foreground text-sm">Manage everything from disciplinary and counselling records to OHS incidents and library loans in a single, centralized system.</p>
                            </div>
                        </div>
                    </div>
                </Slide>
                
                <section id="login-section" className="h-screen w-full flex flex-col items-center justify-center p-8 snap-start">
                    <Card className="w-full max-w-md bg-background shadow-2xl">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
                            <CardDescription>Select a role to log in to the demo.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleLogin}>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="systemadmin@system.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" placeholder="••••••••" defaultValue="admin12345" />
                                </div>
                                <div>
                                    <Label htmlFor="role-select">Select Role (for Demo)</Label>
                                     <Select value={selectedRole} onValueChange={(value) => handleRoleChange(value as Role)}>
                                        <SelectTrigger id="role-select">
                                            <SelectValue placeholder="Select a role to simulate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(MOCK_USERS).map(role => (
                                                <SelectItem key={role} value={role}>
                                                    {role.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                                    {isLoading ? "Logging in..." : "Login"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </section>
            </div>
        </div>
    );
}
