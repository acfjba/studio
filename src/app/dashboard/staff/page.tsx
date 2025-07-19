"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, Edit3, Trash2, Eye, UsersRound, AlertCircle, AlertTriangle } from "lucide-react";
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
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StaffMemberSchema, type StaffMember } from "@/lib/schemas/staff";
import { staffData as sampleStaffSeedData } from '@/lib/data';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

// --- Firestore Actions (only work if db is configured) ---

async function getStaffListFromFirestore(): Promise<StaffMember[]> {
    if (!db) throw new Error("Firestore is not configured.");
    const staffCollectionRef = collection(db, 'staff');
    const staffSnapshot = await getDocs(staffCollectionRef);
    const staffList = staffSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        } as StaffMember;
    });
    return staffList;
}

async function addStaffToFirestore(staffData: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'schoolId'>): Promise<StaffMember> {
    if (!db) throw new Error("Firestore is not configured.");
    const staffCollectionRef = collection(db, 'staff');
    const fullStaffData = {
        ...staffData,
        role: 'teacher', // Default role
        schoolId: localStorage.getItem('schoolId') || 'default-school',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(staffCollectionRef, fullStaffData);
    return { ...fullStaffData, id: docRef.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

async function updateStaffInFirestore(staffData: StaffMember): Promise<StaffMember> {
    if (!db || !staffData.id) throw new Error("Firestore is not configured or staff ID is missing.");
    const staffDocRef = doc(db, 'staff', staffData.id);
    const dataToUpdate: Partial<StaffMember> & { updatedAt: any } = { ...staffData, updatedAt: serverTimestamp() };
    delete (dataToUpdate as any).id;
    await updateDoc(staffDocRef, dataToUpdate as any);
    return { ...staffData, updatedAt: new Date().toISOString() };
}

async function deleteStaffFromFirestore(staffId: string): Promise<void> {
    if (!db) throw new Error("Firestore is not configured.");
    const staffDocRef = doc(db, 'staff', staffId);
    await deleteDoc(staffDocRef);
}

export default function StaffRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const addForm = useForm<Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'schoolId'>>({
    resolver: zodResolver(StaffMemberSchema.omit({ id: true, createdAt: true, updatedAt: true, role: true, schoolId: true })),
  });

  const editForm = useForm<StaffMember>({
    resolver: zodResolver(StaffMemberSchema),
  });

  const fetchStaffList = useCallback(async () => {
    setIsLoading(true);
    try {
        if (isFirebaseConfigured) {
            const result = await getStaffListFromFirestore();
            setStaffList(result);
        } else {
            setStaffList(sampleStaffSeedData);
        }
    } catch (error) {
        console.error("Error fetching staff:", error);
        toast({ variant: "destructive", title: "Error Fetching Staff", description: "Could not load live data. Using local mock data as a fallback." });
        setStaffList(sampleStaffSeedData);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchStaffList();
  }, [fetchStaffList]);

  useEffect(() => {
    if (editingStaff) {
      editForm.setValue("staffId", editingStaff.staffId);
      editForm.setValue("name", editingStaff.name);
      editForm.setValue("role", editingStaff.role);
      editForm.setValue("department", editingStaff.department);
      editForm.setValue("status", editingStaff.status);
      editForm.setValue("email", editingStaff.email);
      editForm.setValue("phone", editingStaff.phone || ''); 
      editForm.setValue("schoolId", editingStaff.schoolId);
      editForm.setValue("id", editingStaff.id);
      editForm.setValue("createdAt", editingStaff.createdAt);
      editForm.setValue("updatedAt", editingStaff.updatedAt);
    }
  }, [editingStaff, editForm.setValue]);

  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (staff.staffId && staff.staffId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaffSubmitHandler: SubmitHandler<Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'schoolId'>> = async (data) => {
    if (!isFirebaseConfigured) {
        const newStaffMember: StaffMember = { ...data, id: `mock-${Date.now()}`, role: 'teacher', schoolId: 'SCH-MOCK', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        setStaffList(prev => [...prev, newStaffMember]);
        toast({ title: "Staff Added (Simulated)", description: `${data.name} has been added to the local list.` });
        setIsAddModalOpen(false);
        addForm.reset();
        return;
    }
    try {
        const newStaffMember = await addStaffToFirestore(data);
        setStaffList(prev => [...prev, newStaffMember]);
        toast({ title: "Staff Added", description: `${newStaffMember.name} has been added to Firestore.` });
        setIsAddModalOpen(false);
        addForm.reset();
    } catch (error) {
        console.error("Error adding staff to Firestore:", error);
        toast({ variant: "destructive", title: "Error Adding Staff", description: "An unknown error occurred." });
    }
  };
  
  const handleEditStaffClick = (staff: StaffMember) => {
    setEditingStaff(staff);
  };

  const handleUpdateStaffSubmitHandler: SubmitHandler<StaffMember> = async (data) => {
    if (!editingStaff || !editingStaff.id) return;
     if (!isFirebaseConfigured) {
        setStaffList(staffList.map(s => s.id === editingStaff.id ? { ...data, updatedAt: new Date().toISOString() } : s));
        toast({ title: "Staff Updated (Simulated)", description: `${data.name}'s record has been updated in the local list.` });
        setEditingStaff(null);
        return;
    }
    try {
        const updatedStaff = await updateStaffInFirestore({ ...data, id: editingStaff.id, createdAt: editingStaff.createdAt });
        setStaffList(staffList.map(s => s.id === updatedStaff.id ? updatedStaff : s));
        toast({ title: "Staff Updated", description: `${updatedStaff.name}'s record has been updated in Firestore.` });
        setEditingStaff(null);
    } catch (error) {
        console.error("Error updating staff in Firestore:", error);
        toast({ variant: "destructive", title: "Error Updating Staff", description: "An unknown error occurred." });
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
            setStaffList(staffList.filter(s => s.id !== staffIdToDelete));
            toast({ title: "Staff Deleted", description: `${staffName || 'Staff member'}'s record has been removed.`, variant: "default" });
        } catch (error) {
            console.error("Error deleting staff from Firestore:", error);
            toast({ variant: "destructive", title: "Error Deleting Staff", description: "An error occurred during deletion." });
        }
    }
  };

  return (
      <div className="flex flex-col gap-8">
        <PageHeader title="Staff Records" description={`Manage staff information. ${isFirebaseConfigured ? "Data is LIVE from Firestore." : "Data is from a local simulation."}`} >
             <Dialog open={isAddModalOpen} onOpenChange={(isOpen) => {
              setIsAddModalOpen(isOpen);
              if (!isOpen) addForm.reset();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-5 w-5" /> Add New Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new staff member.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={addForm.handleSubmit(handleAddStaffSubmitHandler)} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="staffIdAdd" className="text-right col-span-1">Staff ID</Label>
                    <Input id="staffIdAdd" {...addForm.register('staffId')} className="col-span-3" />
                  </div>
                  {addForm.formState.errors.staffId && <p className="col-start-2 col-span-3 text-destructive text-xs">{addForm.formState.errors.staffId.message}</p>}
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nameAdd" className="text-right col-span-1">Name</Label>
                    <Input id="nameAdd" {...addForm.register('name')} className="col-span-3" />
                  </div>
                  {addForm.formState.errors.name && <p className="col-start-2 col-span-3 text-destructive text-xs">{addForm.formState.errors.name.message}</p>}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="positionAdd" className="text-right col-span-1">Department</Label>
                    <Input id="positionAdd" {...addForm.register('department')} className="col-span-3" />
                  </div>
                  {addForm.formState.errors.department && <p className="col-start-2 col-span-3 text-destructive text-xs">{addForm.formState.errors.department.message}</p>}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="emailAdd" className="text-right col-span-1">Email</Label>
                    <Input id="emailAdd" type="email" {...addForm.register('email')} className="col-span-3" />
                  </div>
                  {addForm.formState.errors.email && <p className="col-start-2 col-span-3 text-destructive text-xs">{addForm.formState.errors.email.message}</p>}
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phoneAdd" className="text-right col-span-1">Phone</Label>
                    <Input id="phoneAdd" {...addForm.register('phone')} className="col-span-3" />
                  </div>
                  {addForm.formState.errors.phone && <p className="col-start-2 col-span-3 text-destructive text-xs">{addForm.formState.errors.phone.message}</p>}

                  <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={addForm.formState.isSubmitting}>
                      {addForm.formState.isSubmitting ? "Saving..." : "Save Staff"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
                        To connect to your database, please fill in your project credentials in the <code className="font-mono bg-amber-200/50 px-1 py-0.5 rounded">src/lib/firebase/config.ts</code> file.
                    </p>
                </CardContent>
            </Card>
        )}
        <Card className="shadow-xl rounded-lg">
          <CardContent className="pt-6">
            <div className="mb-6">
              <Label htmlFor="searchStaff" className="sr-only">Search Staff</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="searchStaff"
                  type="search"
                  placeholder="Search by name, ID, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
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
                            {searchTerm ? `No staff matched your search for "${searchTerm}".` : "No staff records found. You can add new staff members."}
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
                          <Button variant="ghost" size="icon" onClick={() => alert(`View details for ${staff.name}`)} title="View Details">
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditStaffClick(staff)} title="Edit Staff">
                            <Edit3 className="h-4 w-4 text-accent" />
                          </Button>
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
             {editingStaff && (
              <Dialog open={!!editingStaff} onOpenChange={(isOpen) => { 
                  if (!isOpen) {
                    setEditingStaff(null); 
                    editForm.reset();
                  } 
                }}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Edit Staff Member: {editingStaff.name}</DialogTitle>
                    <DialogDescription>
                      Update the details below.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={editForm.handleSubmit(handleUpdateStaffSubmitHandler)} className="grid gap-4 py-4">
                    <Input type="hidden" {...editForm.register('id')} />
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="staffIdEdit" className="text-right col-span-1">Staff ID</Label>
                      <Input id="staffIdEdit" {...editForm.register('staffId')} className="col-span-3" />
                    </div>
                    {editForm.formState.errors.staffId && <p className="col-start-2 col-span-3 text-destructive text-xs">{editForm.formState.errors.staffId.message}</p>}
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nameEdit" className="text-right col-span-1">Name</Label>
                      <Input id="nameEdit" {...editForm.register('name')} className="col-span-3" />
                    </div>
                    {editForm.formState.errors.name && <p className="col-start-2 col-span-3 text-destructive text-xs">{editForm.formState.errors.name.message}</p>}

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="positionEdit" className="text-right col-span-1">Department</Label>
                      <Input id="positionEdit" {...editForm.register('department')} className="col-span-3" />
                    </div>
                    {editForm.formState.errors.department && <p className="col-start-2 col-span-3 text-destructive text-xs">{editForm.formState.errors.department.message}</p>}
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="emailEdit" className="text-right col-span-1">Email</Label>
                      <Input id="emailEdit" type="email" {...editForm.register('email')} className="col-span-3" />
                    </div>
                    {editForm.formState.errors.email && <p className="col-start-2 col-span-3 text-destructive text-xs">{editForm.formState.errors.email.message}</p>}

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phoneEdit" className="text-right col-span-1">Phone</Label>
                      <Input id="phoneEdit" {...editForm.register('phone')} className="col-span-3" />
                    </div>
                     {editForm.formState.errors.phone && <p className="col-start-2 col-span-3 text-destructive text-xs">{editForm.formState.errors.phone.message}</p>}

                    <DialogFooter>
                       <DialogClose asChild>
                         <Button type="button" variant="outline">Cancel</Button>
                       </DialogClose>
                       <Button type="submit" disabled={editForm.formState.isSubmitting}>
                        {editForm.formState.isSubmitting ? "Updating..." : "Update Staff"}
                       </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
