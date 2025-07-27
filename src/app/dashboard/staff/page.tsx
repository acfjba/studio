
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, Edit3, Trash2, Eye, UsersRound, AlertCircle, AlertTriangle, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { StaffMemberSchema, type StaffMember, StaffMemberFormDataSchema } from "@/lib/schemas/staff";
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp, query, where, setDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userRoles } from '@/lib/schemas/user';

// --- Firestore Actions ---

async function getStaffListFromFirestore(schoolId: string): Promise<StaffMember[]> {
    if (!db) throw new Error("Firestore is not configured.");
    let staffCollectionRef = query(collection(db, 'staff'), where("schoolId", "==", schoolId));
    const staffSnapshot = await getDocs(staffCollectionRef);
    return staffSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        } as StaffMember;
    });
}

async function addStaffToFirestore(staffData: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>, schoolId: string): Promise<StaffMember> {
    if (!db) throw new Error("Firestore is not configured.");
    const staffCollectionRef = collection(db, 'staff');
    const fullStaffData = {
        ...staffData,
        schoolId: schoolId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(staffCollectionRef, fullStaffData);
    return { ...fullStaffData, id: docRef.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

async function updateStaffInFirestore(staffData: Omit<StaffMember, 'createdAt' | 'updatedAt'>): Promise<StaffMember> {
    if (!db || !staffData.id) throw new Error("Firestore is not configured or staff ID is missing.");
    const staffDocRef = doc(db, 'staff', staffData.id);
    
    const dataToUpdate: any = { ...staffData, updatedAt: serverTimestamp() };
    delete dataToUpdate.id;
    delete dataToUpdate.createdAt;

    await updateDoc(staffDocRef, dataToUpdate);
    return { ...staffData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

async function deleteStaffFromFirestore(staffId: string): Promise<void> {
    if (!db) throw new Error("Firestore is not configured.");
    const staffDocRef = doc(db, 'staff', staffId);
    await deleteDoc(staffDocRef);
}

// --- Invite Logic ---
const InviteFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  role: z.enum(userRoles, { required_error: "Please select a role."}),
});
type InviteFormData = z.infer<typeof InviteFormSchema>;

async function sendInviteToBackend(data: InviteFormData, schoolId: string): Promise<{ success: boolean; message: string }> {
    console.log("Creating invite record for:", { ...data, schoolId });
    if (!db) throw new Error("Firestore not configured.");

    const inviteRef = doc(collection(db, 'invites'));
    await setDoc(inviteRef, {
        email: data.email,
        role: data.role,
        schoolId: schoolId,
        status: 'pending',
        createdAt: new Date().toISOString(),
    });

    return { success: true, message: `Invite record created for ${data.email}.` };
}


export default function StaffRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [schoolId, setSchoolId] = useState<string|null>(null);
  const { toast } = useToast();

  const addForm = useForm<Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt' | 'schoolId'>>({ resolver: zodResolver(StaffMemberFormDataSchema) });
  const editForm = useForm<Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt' | 'schoolId'>>({ resolver: zodResolver(StaffMemberFormDataSchema) });
  const inviteForm = useForm<InviteFormData>({ resolver: zodResolver(InviteFormSchema) });

  useEffect(() => {
    const id = localStorage.getItem('schoolId');
    if (id) {
        setSchoolId(id);
    } else {
        setIsLoading(false);
    }
  }, []);

  const fetchStaffList = useCallback(async () => {
    if (!schoolId) return;
    setIsLoading(true);
    try {
        if (isFirebaseConfigured) {
            const result = await getStaffListFromFirestore(schoolId);
            setStaffList(result);
        } else {
            toast({ variant: "destructive", title: "Offline Mode", description: "Firebase not configured. Displaying mock data." });
            setStaffList([]);
        }
    } catch (error) {
        console.error("Error fetching staff:", error);
        toast({ variant: "destructive", title: "Error Fetching Staff", description: "Could not load live data." });
        setStaffList([]);
    }
    setIsLoading(false);
  }, [schoolId, toast]);

  useEffect(() => {
    fetchStaffList();
  }, [fetchStaffList]);


  useEffect(() => {
    if (editingStaff) {
      Object.entries(editingStaff).forEach(([key, value]) => {
          editForm.setValue(key as keyof StaffMember, value);
      });
    }
  }, [editingStaff, editForm]);

  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (staff.staffId && staff.staffId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInviteSubmit: SubmitHandler<InviteFormData> = async (data) => {
      if (!isFirebaseConfigured) {
          toast({ variant: 'destructive', title: 'Action Disabled', description: 'Cannot send invite because Firebase is not configured.' });
          return;
      }
      if (!schoolId) {
          toast({ variant: 'destructive', title: 'Error', description: 'Your school ID is not set. Cannot send invite.' });
          return;
      }
      try {
        const result = await sendInviteToBackend(data, schoolId);
        if(result.success) {
            toast({ title: 'Invite Record Created', description: `An invitation record for ${data.email} has been created.`});
            inviteForm.reset();
        } else {
            toast({ variant: 'destructive', title: 'Failed to Send Invite'});
        }
      } catch (error) {
          const msg = error instanceof Error ? error.message : "An unknown error occurred.";
          toast({ variant: 'destructive', title: 'Failed to Send Invite', description: msg });
      }
  };

  const handleAddSubmit: SubmitHandler<Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>> = async (data) => {
    if (!isFirebaseConfigured) {
      toast({ variant: "destructive", title: "Action Disabled", description: "Cannot add staff because Firebase is not configured." });
      return;
    }
    if (!schoolId) {
       toast({ variant: "destructive", title: "Error Adding Staff", description: "School ID not found." });
       return;
    }
    try {
      await addStaffToFirestore(data, schoolId);
      await fetchStaffList();
      toast({ title: "Staff Added", description: `${data.name} has been added.` });
      setIsAddModalOpen(false);
      addForm.reset();
    } catch (error) {
      console.error("Error adding staff to Firestore:", error);
      toast({ variant: "destructive", title: "Error Adding Staff", description: "An error occurred while adding the staff member." });
    }
  };


  const handleDeleteStaff = async (staffIdToDelete: string, staffName?: string) => {
    if (window.confirm(`Are you sure you want to delete ${staffName || 'this staff member'}?`)) {
        if (!isFirebaseConfigured) {
            setStaffList(staffList.filter(s => s.id !== staffIdToDelete));
            toast({ title: "Staff Deleted (Simulated)", description: `${staffName || 'Staff member'}'s record has been removed.`, variant: "default" });
            return;
        }
        try {
            await deleteStaffFromFirestore(staffIdToDelete);
            await fetchStaffList();
            toast({ title: "Staff Deleted", description: `${staffName || 'Staff member'}'s record has been removed.`, variant: "default" });
        } catch (error) {
            console.error("Error deleting staff from Firestore:", error);
            toast({ variant: "destructive", title: "Error Deleting Staff", description: "An error occurred during deletion." });
        }
    }
  };

  return (
      <div className="flex flex-col gap-8">
        <PageHeader title="Staff Records" description={`Manage staff information for your school.`} >
            <div className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><Mail className="mr-2 h-4 w-4" /> Invite New Staff</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite New Staff Member</DialogTitle>
                            <DialogDescription>
                                This will create an invitation record in the database. A backend process would then send an email.
                            </DialogDescription>
                        </DialogHeader>
                        <form id="invite-form" onSubmit={inviteForm.handleSubmit(handleInviteSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="email-invite">Email Address</Label>
                                <Input id="email-invite" type="email" {...inviteForm.register('email')} />
                                {inviteForm.formState.errors.email && <p className="text-destructive text-sm mt-1">{inviteForm.formState.errors.email.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="role-invite">Role</Label>
                                <Controller
                                    name="role"
                                    control={inviteForm.control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger id="role-invite"><SelectValue placeholder="Select a role" /></SelectTrigger>
                                            <SelectContent>
                                                {userRoles.filter(r => r !== 'system-admin').map(role => <SelectItem key={role} value={role}>{role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {inviteForm.formState.errors.role && <p className="text-destructive text-sm mt-1">{inviteForm.formState.errors.role.message}</p>}
                            </div>
                        </form>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                            <Button type="submit" form="invite-form" disabled={inviteForm.formState.isSubmitting}>
                            {inviteForm.formState.isSubmitting ? 'Sending...' : 'Send Invite'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                         <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Manually</Button>
                    </DialogTrigger>
                    <DialogContent>
                         <DialogHeader>
                            <DialogTitle>Add New Staff Manually</DialogTitle>
                         </DialogHeader>
                         <form id="add-staff-form" onSubmit={addForm.handleSubmit(handleAddSubmit)} className="space-y-3">
                             <div><Label htmlFor="staffId">Staff ID</Label><Input id="staffId" {...addForm.register('staffId')} />{addForm.formState.errors.staffId && <p className="text-destructive text-xs">{addForm.formState.errors.staffId.message}</p>}</div>
                             <div><Label htmlFor="name">Name</Label><Input id="name" {...addForm.register('name')} />{addForm.formState.errors.name && <p className="text-destructive text-xs">{addForm.formState.errors.name.message}</p>}</div>
                             <div><Label htmlFor="role">Role</Label><Input id="role" {...addForm.register('role')} />{addForm.formState.errors.role && <p className="text-destructive text-xs">{addForm.formState.errors.role.message}</p>}</div>
                             <div><Label htmlFor="position">Position</Label><Input id="position" {...addForm.register('position')} />{addForm.formState.errors.position && <p className="text-destructive text-xs">{addForm.formState.errors.position.message}</p>}</div>
                             <div><Label htmlFor="department">Department</Label><Input id="department" {...addForm.register('department')} />{addForm.formState.errors.department && <p className="text-destructive text-xs">{addForm.formState.errors.department.message}</p>}</div>
                             <div><Label htmlFor="status">Status</Label><Input id="status" {...addForm.register('status')} />{addForm.formState.errors.status && <p className="text-destructive text-xs">{addForm.formState.errors.status.message}</p>}</div>
                             <div><Label htmlFor="email">Email</Label><Input id="email" type="email" {...addForm.register('email')} />{addForm.formState.errors.email && <p className="text-destructive text-xs">{addForm.formState.errors.email.message}</p>}</div>
                             <div><Label htmlFor="phone">Phone</Label><Input id="phone" {...addForm.register('phone')} /></div>
                         </form>
                         <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                            <Button type="submit" form="add-staff-form" disabled={addForm.formState.isSubmitting}>Add Staff</Button>
                         </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </PageHeader>

        {!isFirebaseConfigured && (
            <Card className="bg-amber-50 border-amber-300">
                <CardHeader>
                    <CardTitle className="font-headline text-amber-800 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" /> Simulation Mode Active
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-amber-700">
                        The connection to the live Firebase database is not configured. This page is currently displaying local sample data.
                    </p>
                </CardContent>
            </Card>
        )}

        <Card className="shadow-xl rounded-lg">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : filteredStaff.length === 0 ? (
                 <Card className="mt-6 bg-muted/30">
                    <CardHeader>
                        <CardTitle className="font-headline text-base flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5" />
                            No Staff Found
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground">
                            {searchTerm ? `No staff matched your search for "${searchTerm}".` : "No staff records found for this school."}
                        </p>
                    </CardContent>
                </Card>
            ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Staff ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>{staff.staffId}</TableCell>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>{staff.phone}</TableCell>
                        <TableCell className="text-center space-x-1">
                           <Button variant="ghost" size="icon" onClick={() => staff.id && handleDeleteStaff(staff.id, staff.name)} title="Delete Staff">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}

    