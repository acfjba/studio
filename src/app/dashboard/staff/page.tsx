"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, Trash2, AlertCircle, AlertTriangle, Mail } from "lucide-react";
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
import {
  StaffMemberSchema,
  type StaffMember,
  StaffMemberFormDataSchema,
} from "@/lib/schemas/staff";
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp, query, where, setDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userRoles } from '@/lib/schemas/user';

// --- Firestore Actions ---

async function getStaffListFromFirestore(schoolId: string): Promise<StaffMember[]> {
    if (!db) throw new Error("Firestore is not configured.");
    const staffCollectionRef = query(collection(db, 'staff'), where("schoolId", "==", schoolId));
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

async function addStaffToFirestore(
  staffData: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt' | 'schoolId'>,
  schoolId: string
): Promise<StaffMember> {
    if (!db) throw new Error("Firestore is not configured.");
    const staffCollectionRef = collection(db, 'staff');
    const fullStaffData = {
        ...staffData,
        schoolId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(staffCollectionRef, fullStaffData);
    return { ...fullStaffData, id: docRef.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

async function updateStaffInFirestore(
  staffData: Omit<StaffMember, 'createdAt' | 'updatedAt'>
): Promise<StaffMember> {
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
    await deleteDoc(doc(db, 'staff', staffId));
}

// --- Invite Logic ---
const InviteFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  role: z.enum(userRoles, { required_error: "Please select a role." }),
});
type InviteFormData = z.infer<typeof InviteFormSchema>;

async function sendInviteToBackend(data: InviteFormData, schoolId: string) {
    if (!db) throw new Error("Firestore not configured.");
    const inviteRef = doc(collection(db, 'invites'));
    await setDoc(inviteRef, {
        email: data.email,
        role: data.role,
        schoolId,
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
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const { toast } = useToast();

  const addForm = useForm<Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt' | 'schoolId'>>({ resolver: zodResolver(StaffMemberFormDataSchema) });
  const editForm = useForm<Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt' | 'schoolId'>>({ resolver: zodResolver(StaffMemberFormDataSchema) });
  const inviteForm = useForm<InviteFormData>({ resolver: zodResolver(InviteFormSchema) });

  useEffect(() => {
    const id = localStorage.getItem('schoolId');
    if (id) setSchoolId(id);
    else setIsLoading(false);
  }, []);

  const fetchStaffList = useCallback(async () => {
    if (!schoolId) return;
    setIsLoading(true);
    try {
      if (isFirebaseConfigured) {
        const result = await getStaffListFromFirestore(schoolId);
        setStaffList(result);
      } else {
        toast({ variant: "destructive", title: "Offline Mode", description: "Firebase not configured." });
        setStaffList([]);
      }
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Error Fetching Staff", description: "Could not load data." });
      setStaffList([]);
    }
    setIsLoading(false);
  }, [schoolId, toast]);

  useEffect(() => { fetchStaffList(); }, [fetchStaffList]);

  // Prefill edit form: strip out non-form fields first
  useEffect(() => {
    if (!editingStaff) return;
    const { id, schoolId: _, createdAt, updatedAt, ...formFields } = editingStaff;
    Object.entries(formFields).forEach(([key, value]) => {
      editForm.setValue(key as keyof typeof formFields, value as any);
    });
  }, [editingStaff, editForm]);

  const filteredStaff = staffList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit: SubmitHandler<Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>> = async data => {
    if (!isFirebaseConfigured) {
      toast({ variant: "destructive", title: "No Firebase" });
      return;
    }
    if (!schoolId) return;
    try {
      await addStaffToFirestore(data, schoolId);
      await fetchStaffList();
      toast({ title: "Staff Added", description: `${data.name} added.` });
      setIsAddModalOpen(false);
      addForm.reset();
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Error Adding" });
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm("Delete this staff member?")) return;
    if (!isFirebaseConfigured) {
      setStaffList(staffList.filter(s => s.id !== staffId));
      toast({ title: "Deleted (simulated)" });
      return;
    }
    try {
      await deleteStaffFromFirestore(staffId);
      await fetchStaffList();
      toast({ title: "Staff Deleted" });
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Error Deleting" });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Staff Records" description="Manage staff info.">
        <Dialog>
          <DialogTrigger asChild>
            <Button><Mail className="mr-2 h-4 w-4" /> Invite New Staff</Button>
          </DialogTrigger>
          <DialogContent>
            {/* Invite form… */}
          </DialogContent>
        </Dialog>
        <Button onClick={() => setIsAddModalOpen(true)}><PlusCircle /> Add Staff</Button>
      </PageHeader>

      {/* Simulation notice if needed… */}

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Staff List</CardTitle>
            </div>
            <div>
              <Input placeholder="Search…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading
            ? <Skeleton />
            : filteredStaff.length === 0
              ? <AlertCircle />
              : <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map(st => (
                      <TableRow key={st.id}>
                        <TableCell>{st.staffId}</TableCell>
                        <TableCell>{st.name}</TableCell>
                        <TableCell>{st.role}</TableCell>
                        <TableCell>{st.email}</TableCell>
                        <TableCell>{st.phone}</TableCell>
                        <TableCell>
                          <Button size="icon" onClick={() => handleDeleteStaff(st.id)}><Trash2 /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
          }
        </CardContent>
      </Card>

      {/* Add/Edit modals omitted for brevity… insert your existing JSX here */}

    </div>
  );
}
