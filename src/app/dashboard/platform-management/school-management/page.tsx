"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Edit,
  MoreHorizontal,
  PlusCircle,
  Trash2,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { db, isFirebaseConfigured } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  getCountFromServer,
} from "firebase/firestore";

interface School {
  id: string;
  name: string;
  address: string;
  type: string;
  userCount: number;
}

/* ------------------------------------------------------------------ */
/* ------------------  UTILITIES  ----------------------------------- */
/* ------------------------------------------------------------------ */

async function fetchSchoolsWithUsers(): Promise<School[]> {
  /* guard + narrowing */
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase is not configured.");
  }
  const store = db; // <- now typed Firestore (non-null)

  const schoolsSnapshot = await getDocs(collection(store, "schools"));

  const schools: School[] = await Promise.all(
    schoolsSnapshot.docs.map(async (schoolDoc) => {
      const school = schoolDoc.data();
      const usersQuery = query(
        collection(store, "users"),
        where("schoolId", "==", schoolDoc.id),
      );
      const usersSnapshot = await getCountFromServer(usersQuery);
      const userCount = usersSnapshot.data().count;

      return {
        id: schoolDoc.id,
        name: school.name,
        address: school.address,
        type: school.type,
        userCount,
      };
    }),
  );

  return schools;
}

async function deleteSchoolFromBackend(
  schoolId: string,
): Promise<{ success: boolean }> {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase is not configured.");
  }
  await deleteDoc(doc(db, "schools", schoolId));
  // NOTE: in production you’d trigger a Cloud Function
  // for cascading deletes of users, inventory, etc.
  return { success: true };
}

/* ------------------------------------------------------------------ */
/* ------------------  COMPONENT  ----------------------------------- */
/* ------------------------------------------------------------------ */

export default function SchoolManagementPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<
    { id: string; name: string } | null
  >(null);

  const router = useRouter();
  const { toast } = useToast();

  /* load list ------------------------------------------------------- */
  const loadSchools = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isFirebaseConfigured) {
      setError("Firebase is not configured.");
      setIsLoading(false);
      return;
    }

    try {
      const fetched = await fetchSchoolsWithUsers();
      setSchools(fetched);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(msg);
      toast({
        variant: "destructive",
        title: "Error Loading Schools",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  /* delete ---------------------------------------------------------- */
  const handleRemoveSchool = async () => {
    if (!recordToDelete) return;

    toast({
      title: "Removing School…",
      description: `Attempting to remove ${recordToDelete.name}.`,
    });

    try {
      await deleteSchoolFromBackend(recordToDelete.id);
      await loadSchools();
      toast({
        title: "School Removed",
        description: `${recordToDelete.name} (ID: ${recordToDelete.id}) has been removed.`,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Removal Failed",
        description: msg,
      });
    } finally {
      setRecordToDelete(null);
    }
  };

  /* ---------------------------------------------------------------- */

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="School Management"
        description="View, manage, and edit schools on the platform."
      >
        <Link href="/dashboard/platform-management/school-management/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create School
          </Button>
        </Link>
      </PageHeader>

      <Card className="shadow-xl rounded-lg">
        <CardContent className="pt-6">
          {/* loading ---------- */}
          {isLoading && (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          )}

          {/* error ------------ */}
          {!isLoading && error && (
            <Card className="bg-destructive/10 border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* table ------------ */}
          {!isLoading && !error && schools.length > 0 && (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>School&nbsp;ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-center">Users</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono">{s.id}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.address}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{s.userCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">
                                Open menu for {s.name}
                              </span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onSelect={() =>
                                router.push(
                                  `/dashboard/invite-teachers?schoolId=${s.id}`,
                                )
                              }
                            >
                              <Users className="mr-2 h-4 w-4" />
                              Manage Users
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() =>
                                router.push(
                                  `/dashboard/platform-management/school-management/edit/${s.id}`,
                                )
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Info
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onSelect={() =>
                                setRecordToDelete({ id: s.id, name: s.name })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove School
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* empty ------------ */}
          {!isLoading && !error && schools.length === 0 && (
            <Card className="mt-6 bg-muted/30 border">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  No Schools Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  There are no schools to display. Use the “Create School” button
                  to add one.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* confirm delete dialog -------------------------------------- */}
      <AlertDialog
        open={!!recordToDelete}
        onOpenChange={(open) => !open && setRecordToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <strong>{recordToDelete?.name}</strong> (ID:
              {recordToDelete?.id}). This action cannot be undone and will not
              automatically delete associated users or data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveSchool}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Remove School
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
