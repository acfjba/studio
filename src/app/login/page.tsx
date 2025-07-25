
"use client";

import React from 'react';
import Link from 'next/link';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Loader2, Mail, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { userRoles } from '@/lib/schemas/user';

const InviteUserSchema = z.object({
  email: z.string().email({ message: "A valid email address is required." }),
  role: z.enum(userRoles, { required_error: "Please select a role for the user." }),
  schoolId: z.string().optional(),
}).refine(data => {
    // School ID is required for all roles except system-admin
    if (data.role !== 'system-admin' && (!data.schoolId || data.schoolId.trim().length === 0)) {
        return false;
    }
    return true;
}, {
    message: "School ID is required for this role.",
    path: ["schoolId"],
});

type InviteUserFormData = z.infer<typeof InviteUserSchema>;

// This function writes an invite document to Firestore.
// A backend Cloud Function would then listen to this collection to send the email.
async function createInviteInBackend(data: InviteUserFormData): Promise<{ success: boolean }> {
    if (!db) {
        throw new Error("Firebase is not configured.");
    }
    const inviteCollectionRef = collection(db, 'invites');
    await addDoc(inviteCollectionRef, {
        ...data,
        status: 'pending', // To be processed by backend
        createdAt: serverTimestamp(),
    });
    return { success: true };
}

export default function InviteUserPage() {
    const { toast } = useToast();
    const { 
        register, 
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting } 
    } = useForm<InviteUserFormData>({
        resolver: zodResolver(InviteUserSchema)
    });

    const watchedRole = watch('role');

    const onSubmit: SubmitHandler<InviteUserFormData> = async (data) => {
        if (!isFirebaseConfigured) {
            toast({
                variant: 'destructive',
                title: 'Action Failed',
                description: 'Firebase is not configured. Cannot send invite.',
            });
            return;
        }

        try {
            await createInviteInBackend(data);
            toast({
                title: "Invite Sent",
                description: `An invitation has been successfully queued for ${data.email}.`,
            });
        } catch (error) {
            const msg = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                variant: 'destructive',
                title: 'Invite Failed',
                description: msg,
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/40">
            <PageHeader 
                title="Invite New User"
                description="Send an email invitation for a new user to join the platform."
            >
              <Link href="/">
                <Button variant="outline"><Home className="mr-2 h-4 w-4"/>Back to Home</Button>
              </Link>
            </PageHeader>

            {!isFirebaseConfigured && (
                <Alert variant="destructive" className="max-w-md w-full mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Firebase Not Configured</AlertTitle>
                    <AlertDescription>
                        The application cannot connect to Firebase. The form is in read-only mode and invites cannot be sent.
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <Card className="max-w-md mx-auto w-full">
                    <CardHeader>
                        <CardTitle>User Invitation</CardTitle>
                        <CardDescription>The user will receive an email with a link to set up their account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" {...register('email')} placeholder="user@school.com" />
                            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="role">Assign Role</Label>
                             <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger id="role"><SelectValue placeholder="Select a role" /></SelectTrigger>
                                        <SelectContent>
                                            {userRoles.map(role => (
                                                <SelectItem key={role} value={role}>
                                                    {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.role && <p className="text-sm text-destructive mt-1">{errors.role.message}</p>}
                        </div>
                        {watchedRole && watchedRole !== 'system-admin' && (
                            <div>
                                <Label htmlFor="schoolId">School ID</Label>
                                <Input id="schoolId" {...register('schoolId')} placeholder="e.g., SCH-001" />
                                {errors.schoolId && <p className="text-sm text-destructive mt-1">{errors.schoolId.message}</p>}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting || !isFirebaseConfigured} className="w-full">
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Mail className="mr-2 h-4 w-4"/>}
                            {isSubmitting ? 'Sending Invite...' : 'Send Invitation'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
