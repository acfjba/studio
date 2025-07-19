"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Save, AlertCircle, Loader2, Printer, Download, BarChart3, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import type { PrimaryInventory, PrimaryInventoryItem } from '@/lib/schemas/primaryInventory';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from '@/components/layout/page-header';

// Define a more flexible type for local state editing to handle empty inputs
type EditablePrimaryInventoryItem = Omit<PrimaryInventoryItem, 'quantity' | 'value'> & {
    quantity: number | '';
    value: number | '';
};

const initialPrimaryInventoryItems: EditablePrimaryInventoryItem[] = [
    { id: "item-1", itemName: "Student Desks", quantity: 150, value: 75.00, remarks: "Mixed condition" },
    { id: "item-2", itemName: "Student Chairs", quantity: 160, value: 40.00, remarks: "5 need minor repairs" },
    { id: "item-3", itemName: "Teacher Desks", quantity: 12, value: 150.00, remarks: "" },
    { id: "item-4", itemName: "Teacher Chairs", quantity: 12, value: 80.00, remarks: "" },
    { id: "item-5", itemName: "Whiteboards / Blackboards", quantity: 15, value: 200.00, remarks: "" },
    { id: "item-6", itemName: "Office Filing Cabinets", quantity: 8, value: 250.00, remarks: "" },
    { id: "item-7", itemName: "Computers (Lab/Office)", quantity: 25, value: 800.00, remarks: "Due for refresh in 2025" },
    { id: "item-8", itemName: "Printers / Scanners", quantity: 5, value: 400.00, remarks: "" },
    { id: "item-9", itemName: "Projectors", quantity: 4, value: 600.00, remarks: "" },
    { id: "item-10", itemName: "Library Bookshelves", quantity: 20, value: 300.00, remarks: "" },
];

async function fetchPrimaryInventoryFromBackend(schoolId?: string): Promise<EditablePrimaryInventoryItem[]> {
  console.log("Simulating fetch PRIMARY inventory from backend...", { schoolId });
  await new Promise(resolve => setTimeout(resolve, 800));
  return JSON.parse(JSON.stringify(initialPrimaryInventoryItems));
}

async function savePrimaryInventoryToBackend(inventory: PrimaryInventory): Promise<{ success: boolean }> {
  console.log("Simulating save PRIMARY inventory to backend:", inventory);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}

export default function PrimarySchoolInventoryPage() {
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [inventoryItems, setInventoryItems] = useState<EditablePrimaryInventoryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const canEdit = useMemo(() => {
      const editableRoles = ['head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin'];
      return editableRoles.includes(userRole || '');
  }, [userRole]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    }
  }, []);

  const loadInventory = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const schoolId = localStorage.getItem('schoolId') || undefined;
      const data = await fetchPrimaryInventoryFromBackend(schoolId);
      setInventoryItems(data);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load inventory data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);
  
  const handleInputChange = (itemId: string, field: keyof EditablePrimaryInventoryItem, value: string | number) => {
    setInventoryItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          if (field === 'quantity' || field === 'value') {
            const strVal = String(value);
            if (strVal === '' || /^\d*\.?\d*$/.test(strVal)) {
              return { ...item, [field]: value };
            }
            return item;
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };
  
  const handleSaveInventory = async () => {
    if (!inventoryItems) {
      toast({ variant: "destructive", title: "No Data", description: "No inventory data to save."});
      return;
    }
    if (!canEdit) {
      toast({ variant: "destructive", title: "Permission Denied", description: "You do not have permission to save changes."});
      return;
    }
    setIsSaving(true);
    try {
      const payload: PrimaryInventory = {
        lastUpdatedBy: "currentUserPlaceholderId",
        updatedAt: new Date().toISOString(),
        items: inventoryItems.map(item => ({
            ...item,
            quantity: Number(item.quantity) || 0,
            value: Number(item.value) || 0,
        })),
      };
      await savePrimaryInventoryToBackend(payload);
      toast({ title: "Primary Inventory Saved", description: `Primary school inventory has been saved successfully.`});
    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed", description: "Could not save inventory data."});
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    toast({ title: "Printing...", description: "Use your browser's print dialog to save as PDF or print." });
    window.print();
  };
  
  const handleAddItem = () => {
    if (!newItemName.trim()) {
      toast({ variant: "destructive", title: "Item name cannot be empty." });
      return;
    }
    const newItem: EditablePrimaryInventoryItem = {
      id: `custom-${Date.now()}`,
      itemName: newItemName.trim(),
      quantity: '',
      value: '',
      remarks: '',
    };
    setInventoryItems(prev => [...prev, newItem]);
    setNewItemName('');
    toast({ title: "Item Added", description: `"${newItem.itemName}" has been added to the list.`});
  };

  const handleRemoveItem = (itemIdToRemove: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== itemIdToRemove));
    toast({ title: "Item Removed", description: "The item has been removed from your inventory list." });
  };
  
  return (
    <div className="flex flex-col gap-8 printable-area">
        <PageHeader 
            title="Primary School Inventory"
            description="Manage fixed assets and major supplies for the entire primary school."
        />
        <Card className="shadow-xl rounded-lg w-full max-w-5xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
              <div>
                <Link href="/dashboard/inventory/summary" passHref>
                    <Button variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" /> View Inventory Summary
                    </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handlePrint} variant="outline" disabled={isLoading || isSaving}>
                    <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button disabled={isSaving || isLoading || !canEdit}>
                      <Save className="mr-2 h-4 w-4" /> Save Inventory
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Inventory Update</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to save changes to the primary school inventory. Please ensure all records are correct.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSaveInventory} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isSaving ? "Saving..." : "Continue & Save"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {!canEdit && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Read-Only Mode</AlertTitle>
                    <AlertDescription>
                        You do not have permission to edit this inventory. Changes cannot be saved.
                    </AlertDescription>
                </Alert>
            )}

            {isLoading && (
              <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
              </div>
            )}
            {fetchError && (
              <Card className="bg-destructive/10 border-destructive print:hidden">
                  <CardHeader><CardTitle className="text-base text-destructive flex items-center"><AlertCircle className="mr-2 h-5 w-5" /> Error Loading Inventory</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-destructive">{fetchError}</p></CardContent>
              </Card>
            )}

            {!isLoading && !fetchError && (
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold w-[30%]">Item Name</TableHead>
                      <TableHead className="font-bold text-center">Quantity</TableHead>
                      <TableHead className="font-bold text-center">Value (per item)</TableHead>
                      <TableHead className="font-bold text-center">Total Value</TableHead>
                      <TableHead className="font-bold w-[25%]">Remarks</TableHead>
                      <TableHead className="font-bold text-center print:hidden">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell><Input value={item.itemName} onChange={(e) => handleInputChange(item.id, 'itemName', e.target.value)} disabled={!canEdit} className="font-medium" /></TableCell>
                        <TableCell><Input type="text" className="text-center" value={item.quantity} onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)} disabled={!canEdit} /></TableCell>
                        <TableCell><Input type="text" className="text-center" value={item.value} onChange={(e) => handleInputChange(item.id, 'value', e.target.value)} disabled={!canEdit} /></TableCell>
                        <TableCell className="text-center align-middle font-bold">{(Number(item.quantity) * Number(item.value)).toFixed(2)}</TableCell>
                        <TableCell><Input value={item.remarks || ''} onChange={(e) => handleInputChange(item.id, 'remarks', e.target.value)} disabled={!canEdit} /></TableCell>
                        <TableCell className="text-center print:hidden">
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="ghost" size="icon" disabled={!canEdit} title="Remove Item"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently remove the item "{item.itemName}" from the inventory list.</AlertDialogDescription></AlertDialogHeader>
                                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleRemoveItem(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Yes, Remove Item</AlertDialogAction></AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {canEdit && (
                <Card className="mt-8 p-4 bg-muted/50 print:hidden">
                    <CardHeader className="p-2"><CardTitle className="text-lg">Add Custom Item</CardTitle></CardHeader>
                    <CardContent className="p-2 flex flex-col sm:flex-row items-center gap-4">
                        <Label htmlFor="new-item-name" className="sr-only">New Item Name</Label>
                        <Input id="new-item-name" placeholder="Enter new item name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="flex-grow" />
                        <Button onClick={handleAddItem} className="w-full sm:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> Add Item to List</Button>
                    </CardContent>
                </Card>
            )}

          </CardContent>
        </Card>
      </div>
  );
}
