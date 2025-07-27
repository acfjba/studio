
"use client";

import React, { useState, type ChangeEvent, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, AlertTriangle, Loader2, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRoles, SingleUserFormSchema, type UserFormData } from "@/lib/schemas/user";
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from '@/components/layout/page-header';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';


// --- Backend Functions ---
async function addSingleUserToBackend(userData: UserFormData): Promise<{ success: boolean; message: string }> {
    console.log("Adding single user to backend:", userData);
    if (!db) throw new Error("Firestore not configured.");

    // This would typically be handled by a secure backend Cloud Function
    // For this demo, we are writing to a public 'invites' collection
    // A backend trigger would then create the Auth user and send the email.
    const inviteRef = doc(collection(db, 'invites'));
    await setDoc(inviteRef, {
        email: userData.email,
        role: userData.role,
        schoolId: userData.schoolId || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
    });

    return { success: true, message: `Invite sent to ${userData.email}.` };
}

async function addMultipleUsersToBackend(users: UserFormData[]): Promise<{ success: boolean; message: string; report: { success: UserFormData[]; failed: { data: string; reason: string }[] } }> {
    console.log("Adding multiple users to backend:", users);
    if (!db) throw new Error("Firestore not configured.");

    const failed: { data: string; reason: string }[] = [];
    // In a real app, you'd use a batch write here.
    for (const user of users) {
        try {
            const inviteRef = doc(collection(db, 'invites'));
            await setDoc(inviteRef, {
                email: user.email,
                role: user.role,
                schoolId: user.schoolId || null,
                status: 'pending',
                createdAt: new Date().toISOString(),
            });
        } catch (error) {
            failed.push({ data: user.email, reason: "Firestore write failed" });
        }
    }
    
    return { 
        success: true, 
        message: `Processed ${users.length} users.`,
        report: { success: users, failed }
    };
}

async function fetchSchools(): Promise<{id: string, name: string}[]> {
    if (!db || !isFirebaseConfigured) return [];
    const schoolsSnapshot = await getDocs(collection(db, "schools"));
    return schoolsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
}

// ---

export default function UserManagementPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [users, setUsers] = useState<UserFormData[]>([]);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [schools, setSchools] = useState<{id: string, name: string}[]>([]);


    useEffect(() => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
        if (role === 'system-admin' || role === 'primary-admin' || role === 'head-teacher') {
            setHasAccess(true);
        } else {
            toast({
                variant: 'destructive',
                title: 'Access Denied',
                description: 'You do not have permission to view this page.',
            });
            router.push('/dashboard'); // Redirect to a safe page
            setHasAccess(false);
        }

        const loadSchools = async () => {
            const fetchedSchools = await fetchSchools();
            setSchools(fetchedSchools);
        };
        loadSchools();
    }, [router, toast]);

    const singleUserForm = useForm<UserFormData>({
        resolver: zodResolver(SingleUserFormSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            role: 'teacher',
            schoolId: 'none',
            password: '',
        }
    });

    const [multipleUsersData, setMultipleUsersData] = useState('');

    const handleSingleUserSubmit: SubmitHandler<UserFormData> = async (data) => {
        const result = await addSingleUserToBackend(data);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            
            const newUser: UserFormData = { ...data };
            setUsers(prevUsers => [newUser, ...prevUsers]);

            singleUserForm.reset();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };
    
    const handleMultipleUsersSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (file) {
            toast({
                title: "File Upload Not Implemented",
                description: `This is a placeholder for server-side file processing.`,
            });
            return;
        }

        const lines = multipleUsersData.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) {
            toast({ variant: "destructive", title: "Input Required", description: "Please provide user data in the text area." });
            return;
        }
        
        const usersToCreate: UserFormData[] = [];
        const failedEntries: { data: string; reason: string }[] = [];

        lines.forEach(line => {
            const [name, email, phone, role, schoolId, password] = line.split(',').map(s => s.trim());
            const validationResult = SingleUserFormSchema.safeParse({ name, email, phone, role, schoolId, password });

            if (validationResult.success) {
                usersToCreate.push(validationResult.data);
            } else {
                failedEntries.push({ data: line, reason: validationResult.error.errors.map(e => e.message).join(', ') });
            }
        });
        
        if (usersToCreate.length === 0 && failedEntries.length > 0) {
            toast({
                variant: "destructive",
                title: "Validation Failed",
                description: `No valid user entries found. Check format and try again. First error: ${failedEntries[0].reason}`,
            });
            return;
        }

        const result = await addMultipleUsersToBackend(usersToCreate);

        if (result.success) {
            const addedUsers = result.report.success.map(u => ({ ...u }));
            setUsers(prevUsers => [...addedUsers, ...prevUsers]);
            toast({
                title: "Batch Processed",
                description: `Successfully sent invites for ${result.report.success.length} users. Failed to process ${failedEntries.length + result.report.failed.length} users.`,
            });
            setMultipleUsersData('');
        } else {
            toast({ variant: "destructive", title: "Batch Error", description: result.message });
        }
    };
    
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setMultipleUsersData(""); // Clear textarea if a file is selected
        }
    };

    if (hasAccess === null) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
  
    if (!hasAccess) {
        return null; // Render nothing while redirecting
    }

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Invite & Manage Users"
                description="Add new users to the platform individually or in bulk."
            />
            <div className="space-y-8">
                <Card className="shadow-xl rounded-lg max-w-4xl mx-auto">
                    <CardContent className="pt-6">
                        <Tabs defaultValue="single" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="single">Invite Single User</TabsTrigger>
                                <TabsTrigger value="multiple">Invite Multiple Users</TabsTrigger>
                            </TabsList>
                            
                            {/* Single User Tab */}
                            <TabsContent value="single" className="mt-6">
                                <form onSubmit={singleUserForm.handleSubmit(handleSingleUserSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" {...singleUserForm.register("name")} />
                                            {singleUserForm.formState.errors.name && <p className="text-destructive text-xs mt-1">{singleUserForm.formState.errors.name.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" {...singleUserForm.register("email")} />
                                            {singleUserForm.formState.errors.email && <p className="text-destructive text-xs mt-1">{singleUserForm.formState.errors.email.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone Number (Optional)</Label>
                                            <Input id="phone" type="tel" {...singleUserForm.register("phone")} />
                                            {singleUserForm.formState.errors.phone && <p className="text-destructive text-xs mt-1">{singleUserForm.formState.errors.phone.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="role">Role</Label>
                                            <Controller
                                                name="role"
                                                control={singleUserForm.control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger id="role"><SelectValue placeholder="Select a role" /></SelectTrigger>
                                                        <SelectContent>
                                                            {userRoles.map(role => <SelectItem key={role} value={role}>{role.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {singleUserForm.formState.errors.role && <p className="text-destructive text-xs mt-1">{singleUserForm.formState.errors.role.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="schoolId">School</Label>
                                            <Controller
                                                name="schoolId"
                                                control={singleUserForm.control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger id="schoolId"><SelectValue placeholder="Select a school (if not System Admin)" /></SelectTrigger>
                                                        <SelectContent>
                                                          <SelectItem value="none">N/A (for System Admin)</SelectItem>
                                                          {schools.map(school => <SelectItem key={school.id} value={school.id}>{school.name} ({school.id})</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {singleUserForm.formState.errors.schoolId && <p className="text-destructive text-xs mt-1">{singleUserForm.formState.errors.schoolId.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="password">Temporary Password</Label>
                                            <Input id="password" type="password" {...singleUserForm.register("password")} placeholder="User will be prompted to change"/>
                                            {singleUserForm.formState.errors.password && <p className="text-destructive text-xs mt-1">{singleUserForm.formState.errors.password.message}</p>}
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={singleUserForm.formState.isSubmitting}>
                                        {singleUserForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                                        {singleUserForm.formState.isSubmitting ? 'Sending Invite...' : 'Send Invite'}
                                    </Button>
                                </form>
                            </TabsContent>
                            
                            {/* Multiple Users Tab */}
                            <TabsContent value="multiple" className="mt-6">
                                <form onSubmit={handleMultipleUsersSubmit} className="space-y-6">
                                    <Card className="bg-amber-50 border-amber-300">
                                        <CardHeader>
                                            <CardTitle className="font-headline text-base text-amber-800 flex items-center">
                                                <AlertTriangle className="mr-2 h-5 w-5" />
                                                Method 1: Paste CSV Data
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="font-body text-sm text-amber-700">
                                                Enter one user per line in the following CSV format: <br/>
                                                <code className="font-mono bg-amber-200/50 px-1 py-0.5 rounded">FullName,email@example.com,phone,role,schoolId,password</code>
                                            </p>
                                            <p className="font-body text-xs text-amber-600 mt-2">
                                                - **Roles:** {userRoles.join(', ')}<br/>
                                                - **School ID:** Use 'none' or leave blank for System Admins. Required for all other roles.<br/>
                                                - Example: <code className="font-mono bg-amber-200/50 px-1 py-0.5 rounded">John Doe,john.d@school.com,555-1234,teacher,SCH-001,password123</code>
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <div>
                                        <Label htmlFor="usersData">Users Data (CSV Format)</Label>
                                        <Textarea
                                            id="usersData"
                                            value={multipleUsersData}
                                            onChange={(e) => setMultipleUsersData(e.target.value)}
                                            rows={8}
                                            placeholder="Jane Doe,jane.d@school.com,555-5678,teacher,SCH-001,newpass&#x0a;Peter Jones,peter.j@school.com,555-9012,teacher,SCH-002,anotherpass"
                                            disabled={!!file}
                                        />
                                    </div>
                                    
                                    <div className="relative">
                                        <Separator />
                                        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-sm text-muted-foreground">OR</span>
                                    </div>

                                    <Card className="bg-blue-50 border-blue-200">
                                        <CardHeader>
                                            <CardTitle className="font-headline text-base text-blue-800 flex items-center">
                                                <FileUp className="mr-2 h-5 w-5" />
                                                Method 2: Upload a File
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Label htmlFor="file-upload">Upload Excel, Word, or PDF</Label>
                                            <Input
                                                id="file-upload"
                                                type="file"
                                                accept=".xlsx,.xls,.doc,.docx,.pdf"
                                                onChange={handleFileChange}
                                                disabled={!!multipleUsersData}
                                            />
                                            <p className="font-body text-xs text-blue-600 mt-2">
                                                The uploaded file would be processed on the server to extract and create users.
                                            </p>
                                            {file && <p className="font-body text-sm mt-2 text-blue-800">Selected: {file.name}</p>}
                                        </CardContent>
                                    </Card>

                                    <Button type="submit" className="w-full" disabled={singleUserForm.formState.isSubmitting}>
                                        {singleUserForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-5 w-5" />}
                                        {singleUserForm.formState.isSubmitting ? 'Processing...' : 'Process & Invite Users'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card className="shadow-xl rounded-lg max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl text-primary">Recently Invited Users</CardTitle>
                        <CardDescription>This table shows users invited during this session.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>School ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length > 0 ? users.map((user, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>{user.schoolId || 'N/A'}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">No users invited yet.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    