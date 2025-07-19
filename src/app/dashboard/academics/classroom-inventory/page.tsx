"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Boxes, Save, AlertCircle, Loader2, Printer, Download, BarChart3, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageHeader } from '@/components/layout/page-header';
import type { ClassroomInventory, EditableInventoryItem } from '@/lib/schemas/classroom-inventory';


const initialInventoryItems: EditableInventoryItem[] = [
    { id: "item-1", itemName: "Textbooks", quantityStart: 120, quantityAdded: 10, quantityLost: 5, remarks: "English and Math" },
    { id: "item-2", itemName: "Exercise Books", quantityStart: 200, quantityAdded: 50, quantityLost: 2, remarks: "" },
    { id: "item-3", itemName: "Pens", quantityStart: 150, quantityAdded: 20, quantityLost: 15, remarks: "Blue ink" },
    { id: "item-4", itemName: "Pencils", quantityStart: 180, quantityAdded: 30, quantityLost: 25, remarks: "HB" },
    { id: "item-5", itemName: "Rulers", quantityStart: 50, quantityAdded: 5, quantityLost: 3, remarks: "" },
    { id: "item-6", itemName: "Erasers", quantityStart: 75, quantityAdded: 10, quantityLost: 8, remarks: "" },
    { id: "item-7", itemName: "Chalk / Markers", quantityStart: 30, quantityAdded: 10, quantityLost: 4, remarks: "Whiteboard markers low" },
    { id: "item-8", itemName: "Charts & Posters", quantityStart: 25, quantityAdded: 2, quantityLost: 1, remarks: "" },
    { id: "item-9", itemName: "First Aid Kits", quantityStart: 2, quantityAdded: 1, quantityLost: 0, remarks: "Checked monthly" },
    { id: "item-10", itemName: "Art Supplies (crayons, paper)", quantityStart: 40, quantityAdded: 5, quantityLost: 2, remarks: "" },
    { id: "item-11", itemName: "Sports Equipment (balls, cones)", quantityStart: 15, quantityAdded: 3, quantityLost: 1, remarks: "1 soccer ball punctured" },
    { id: "item-12", itemName: "Science Kits", quantityStart: 5, quantityAdded: 0, quantityLost: 0, remarks: "" },
    { id: "item-13", itemName: "Cleaning Supplies (wipes, sanitizer)", quantityStart: 20, quantityAdded: 5, quantityLost: 3, remarks: "" },
    { id: "item-14", itemName: "Staplers & Staples", quantityStart: 10, quantityAdded: 2, quantityLost: 1, remarks: "" },
    { id: "item-15", itemName: "Paper Clips & Pins", quantityStart: 100, quantityAdded: 0, quantityLost: 10, remarks: "" },
    { id: "item-16", itemName: "Globes & Maps", quantityStart: 3, quantityAdded: 0, quantityLost: 0, remarks: "" },
    { id: "item-17", itemName: "Projectors & Screens", quantityStart: 1, quantityAdded: 0, quantityLost: 0, remarks: "" },
    { id: "item-18", itemName: "Teacher's Guides", quantityStart: 50, quantityAdded: 5, quantityLost: 1, remarks: "" },
    { id: "item-19", itemName: "Other Supplies", quantityStart: 0, quantityAdded: 0, quantityLost: 0, remarks: "" },
];

async function fetchInventoryFromBackend(yearLevel: string, schoolId?: string): Promise<EditableInventoryItem[]> {
  console.log("Simulating fetch inventory from backend...", { yearLevel, schoolId });
  await new Promise(resolve => setTimeout(resolve, 800));
  return JSON.parse(JSON.stringify(initialInventoryItems));
}

async function saveInventoryToBackend(inventory: ClassroomInventory): Promise<{ success: boolean }> {
  console.log("Simulating save inventory to backend:", inventory);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}

export default function ClassroomInventoryPage() {
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>('teacher');
  const [selectedYear, setSelectedYear] = useState<string>("1");
  const [inventoryItems, setInventoryItems] = useState<EditableInventoryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const canEdit = useMemo(() => {
    const editableRoles = ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin'];
    return editableRoles.includes(userRole || '');
  }, [userRole]);

  const canViewSummary = useMemo(() => userRole === 'head-teacher' || userRole === 'assistant-head-teacher' || userRole === 'primary-admin' || userRole === 'system-admin', [userRole]);

  // In a real app, user role would be fetched from an auth context
  // For this demo, we'll just simulate it.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole') || 'teacher';
      setUserRole(role);
      console.log("Classroom Inventory User Role:", role);
    }
  }, []);

  const loadInventory = useCallback(async (year: string) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const schoolId = localStorage.getItem('schoolId') || undefined;
      const data = await fetchInventoryFromBackend(year, schoolId);
      setInventoryItems(data);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load inventory data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory(selectedYear);
  }, [selectedYear, loadInventory]);

  const handleInputChange = (itemId: string, field: keyof EditableInventoryItem, value: string) => {
    setInventoryItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          if (field === 'quantityStart' || field === 'quantityAdded' || field === 'quantityLost') {
            if (value === '' || /^\d*$/.test(value)) {
              return { ...item, [field]: value };
            }
            return item; // Do not update for invalid number input
          }
          return { ...item, [field]: value }; // Update string fields
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
        const payload: ClassroomInventory = {
            yearLevel: parseInt(selectedYear, 10),
            term: "2", // This would be dynamic in a real app
            items: inventoryItems.map(item => ({
                ...item,
                quantityStart: Number(item.quantityStart) || 0,
                quantityAdded: Number(item.quantityAdded) || 0,
                quantityLost: Number(item.quantityLost) || 0,
            })),
            lastUpdatedBy: "currentUserPlaceholderId",
            updatedAt: new Date().toISOString(),
        };
        await saveInventoryToBackend(payload);
        toast({ title: "Inventory Saved", description: `Stock inventory for Year ${selectedYear} has been saved successfully.`});
    } catch (error) {
        toast({ variant: "destructive", title: "Save Failed", description: "Could not save inventory data."});
    } finally {
        setIsSaving(false);
    }
  };

  const calculateCurrentStock = (item: EditableInventoryItem) => {
    const start = Number(item.quantityStart) || 0;
    const added = Number(item.quantityAdded) || 0;
    const lost = Number(item.quantityLost) || 0;
    return start + added - lost;
  };

  const handlePrint = () => {
    toast({ title: "Printing...", description: "Use your browser's print dialog to save as PDF or print." });
    window.print();
  };

  const handleExportCsv = () => {
    if (!inventoryItems) {
      toast({ variant: "destructive", title: "No data", description: "No inventory data available to export." });
      return;
    }

    const headers = ["Item Name", "Start of Term", "Added", "Lost/Damaged", "Current Stock", "Remarks"];
    const rows = inventoryItems.map(item => [
      `"${(item.itemName || '').replace(/"/g, '""')}"`,
      Number(item.quantityStart) || 0,
      Number(item.quantityAdded) || 0,
      Number(item.quantityLost) || 0,
      calculateCurrentStock(item),
      `"${(item.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `classroom_inventory_year_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Exported to CSV", description: "The inventory data has been downloaded." });
  };
  
  const handleAddItem = () => {
    if (!newItemName.trim()) {
      toast({ variant: "destructive", title: "Item name cannot be empty." });
      return;
    }
    const newItem: EditableInventoryItem = {
      id: `custom-${Date.now()}`,
      itemName: newItemName.trim(),
      quantityStart: '',
      quantityAdded: '',
      quantityLost: '',
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
  
  const yearOptions = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

  return (
    <div className="flex flex-col gap-8 printable-area">
        <PageHeader 
            title="Classroom Stock Inventory"
            description="Manage classroom resources and supplies for each year level."
        />
        <Card className="shadow-lg rounded-lg w-full">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
              <div className="flex items-center gap-4">
                <Label htmlFor="year-select" className="font-semibold">Select Year Level:</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear} disabled={isLoading}>
                    <SelectTrigger id="year-select" className="w-[180px]">
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {yearOptions.map(year => <SelectItem key={year} value={year}>Year {year}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2">
                {canViewSummary && (
                  <Link href="/dashboard/academics/exam-summary" passHref>
                    <Button variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" /> View Exam Summary
                    </Button>
                  </Link>
                )}
                <Button onClick={handleExportCsv} variant="outline" disabled={isLoading || isSaving}>
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
                <Button onClick={handlePrint} variant="outline" disabled={isLoading || isSaving}>
                    <Printer className="mr-2 h-4 w-4" /> Print / PDF
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button disabled={isSaving || isLoading || !canEdit}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      {isSaving ? "Saving..." : "Save Inventory"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Inventory Update</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to save the changes to the inventory for Year {selectedYear}. This action will update the school-wide summary.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSaveInventory} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Continue & Save"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {isLoading && (
              <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
              </div>
            )}
            {fetchError && (
              <Card className="bg-destructive/10 border-destructive print:hidden">
                  <CardHeader>
                      <CardTitle className="text-base text-destructive flex items-center">
                          <AlertCircle className="mr-2 h-5 w-5" /> Error Loading Inventory
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-destructive">{fetchError}</p>
                  </CardContent>
              </Card>
            )}

            {!isLoading && !fetchError && inventoryItems && (
              <div className="overflow-x-auto border rounded-lg">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[20%]">Item Name</TableHead>
                      <TableHead className="text-center">Start of Term</TableHead>
                      <TableHead className="text-center">Added</TableHead>
                      <TableHead className="text-center">Lost/Damaged</TableHead>
                      <TableHead className="text-center">Current Stock</TableHead>
                      <TableHead className="w-[25%]">Remarks</TableHead>
                      <TableHead className="text-center print:hidden">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.itemName}
                            onChange={(e) => handleInputChange(item.id, 'itemName', e.target.value)}
                            disabled={!canEdit}
                            className="font-medium"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            className="text-center"
                            value={item.quantityStart}
                            onChange={(e) => handleInputChange(item.id, 'quantityStart', e.target.value)}
                            disabled={!canEdit}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            className="text-center"
                            value={item.quantityAdded}
                            onChange={(e) => handleInputChange(item.id, 'quantityAdded', e.target.value)}
                            disabled={!canEdit}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            className="text-center"
                            value={item.quantityLost}
                            onChange={(e) => handleInputChange(item.id, 'quantityLost', e.target.value)}
                            disabled={!canEdit}
                          />
                        </TableCell>
                        <TableCell className="text-center align-middle font-bold text-lg">
                          {calculateCurrentStock(item)}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.remarks || ''}
                            onChange={(e) => handleInputChange(item.id, 'remarks', e.target.value)}
                            disabled={!canEdit}
                          />
                        </TableCell>
                        <TableCell className="text-center print:hidden">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" disabled={!canEdit} title="Remove Item">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          This will permanently remove the item "{item.itemName}" from the inventory list for this year level.
                                      </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleRemoveItem(item.id)} className="bg-destructive hover:bg-destructive/90">
                                          Yes, Remove
                                      </AlertDialogAction>
                                  </AlertDialogFooter>
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
                    <CardHeader className="p-2">
                        <CardTitle className="text-lg">Add Custom Item</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 flex flex-col sm:flex-row items-center gap-4">
                        <Label htmlFor="new-item-name" className="sr-only">New Item Name</Label>
                        <Input
                            id="new-item-name"
                            placeholder="Enter new item name, e.g., 'Whiteboard Markers'"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="flex-grow"
                        />
                        <Button onClick={handleAddItem} className="w-full sm:w-auto">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </CardContent>
                </Card>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
