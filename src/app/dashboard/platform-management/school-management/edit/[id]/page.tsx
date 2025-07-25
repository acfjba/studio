
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const EditSchoolSchema = z.object({
  name: z.string().min(3, 'School Name is required.'),
  address: z.string().min(5, 'Address is required.'),
  type: z.string().min(3, 'School type is required (e.g., Primary, Secondary).'),
});

type EditSchoolFormData = z.infer<typeof EditSchoolSchema>;

async function fetchSchoolFromBackend(id: string): Promise<EditSchoolFormData | null> {
    if (!db || !isFirebaseConfigured) throw new Error("Firebase is not configured.");
    const schoolRef = doc(db, 'schools', id);
    const docSnap = await getDoc(schoolRef);
    if (docSnap.exists()) {
        return docSnap.data() as EditSchoolFormData;
    }
    return null;
}

async function updateSchoolInBackend(id: string, data: EditSchoolFormData): Promise<{ success: boolean }> {
    if (!db || !isFirebaseConfigured) throw new Error("Firebase is not configured.");
    const schoolRef = doc(db, 'schools', id);
    await updateDoc(schoolRef, data);
    return { success: true };
}

export default function EditSchoolPage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const schoolId = params.id as string;

    const { 
        register, 
        handleSubmit, 
        reset,
        formState: { errors, isSubmitting, isDirty } 
    } = useForm<EditSchoolFormData>({
        resolver: zodResolver(EditSchoolSchema)
    });

    useEffect(() => {
        if (!schoolId) return;
        
        const loadSchoolData = async () => {
            try {
                const schoolData = await fetchSchoolFromBackend(schoolId);
                if (schoolData) {
                    reset(schoolData);
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: 'School not found.'});
                    router.push('/dashboard/platform-management/school-management');
                }
            } catch (error) {
                const msg = error instanceof Error ? error.message : "Failed to load school data.";
                toast({ variant: 'destructive', title: 'Error', description: msg });
            }
        };

        loadSchoolData();
    }, [schoolId, reset, router, toast]);

    const onSubmit: SubmitHandler<EditSchoolFormData> = async (data) => {
        try {
            await updateSchoolInBackend(schoolId, data);
            toast({
                title: "School Updated",
                description: `School "${data.name}" has been successfully updated.`,
            });
            router.push('/dashboard/platform-management/school-management');
        } catch (error) {
            const msg = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: msg,
            });
        }
    };

    if (!schoolId) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Edit School"
                description={`Modify the details for school ID: ${schoolId}`}
            >
              <Link href="/dashboard/platform-management/school-management">
                <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Back to List</Button>
              </Link>
            </PageHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>School Details</CardTitle>
                        <CardDescription>The School ID cannot be changed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="id">School ID</Label>
                            <Input id="id" value={schoolId} readOnly disabled />
                        </div>
                         <div>
                            <Label htmlFor="name">School Name</Label>
                            <Input id="name" {...register('name')} placeholder="e.g., Vuda District School" />
                            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" {...register('address')} placeholder="e.g., 123 Main Street, Lautoka" />
                            {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="type">School Type</Label>
                            <Input id="type" {...register('type')} placeholder="e.g., Primary School" />
                            {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting || !isDirty} className="w-full">
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
