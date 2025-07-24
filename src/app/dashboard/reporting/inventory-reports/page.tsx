
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Download, Filter, AlertCircle, Warehouse, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { collectionGroup, getDocs } from 'firebase/firestore';

interface InventoryItemReport {
    id: string;
    item: string;
    quantity: number;
    unitCost: number;
    totalValue: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

async function fetchInventoryReportData(): Promise<any[]> {
    if (!db) throw new Error("Firestore is not configured.");
    const inventoryGroup = collectionGroup(db, 'primaryInventory');
    const snapshot = await getDocs(inventoryGroup);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


export default function InventoryReportsPage() {
    const { toast } = useToast();
    const [inventory, setInventory] = useState<InventoryItemReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string|null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    const loadData = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        if(!isFirebaseConfigured) {
            setIsLoading(false);
            return;
        }
        try {
            const data = await fetchInventoryReportData();
            const processedData = data.map(item => {
                const quantity = item.quantity || 0;
                let status: InventoryItemReport['status'] = 'In Stock';
                if (quantity <= 0) status = 'Out of Stock';
                else if (quantity < 10) status = 'Low Stock'; // Example threshold

                return {
                    id: item.id,
                    item: item.itemName,
                    quantity: quantity,
                    unitCost: item.value || 0,
                    totalValue: (item.quantity || 0) * (item.value || 0),
                    status: status,
                };
            });
            setInventory(processedData);
        } catch (error) {
            setFetchError(error instanceof Error ? error.message : "Could not load inventory data.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        loadData();
    }, [loadData]);
    
    const uniqueStatuses = useMemo(() => ['all', 'In Stock', 'Low Stock', 'Out of Stock'], []);

    const filteredData = useMemo(() => {
        return inventory.filter(item => 
            (statusFilter === 'all' || item.status === statusFilter)
        );
    }, [inventory, statusFilter]);
    
    const statusVariants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
        'In Stock': 'default',
        'Low Stock': 'secondary',
        'Out of Stock': 'destructive',
    };

    const handlePrint = () => {
        toast({ title: "Printing...", description: "Use your browser's print dialog to save as PDF or print." });
        window.print();
    };

    const handleExportCsv = () => {
        if (filteredData.length === 0) {
            toast({ variant: "destructive", title: "No Data", description: "There is no data to export." });
            return;
        }
        const headers = ["Item ID", "Item Name", "Quantity", "Unit Cost", "Total Value", "Status"];
        const rows = filteredData.map(item => [
            item.id,
            `"${item.item.replace(/"/g, '""')}"`,
            item.quantity,
            item.unitCost.toFixed(2),
            item.totalValue.toFixed(2),
            item.status,
        ].join(','));
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Export Successful", description: "Inventory report has been downloaded as a CSV file." });
    };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Inventory Reports"
        description="View reports on stock levels, usage, and value of school inventory."
      />

      {!isFirebaseConfigured && (
        <Card className="bg-amber-50 border-amber-300"><CardHeader><CardTitle className="font-headline text-amber-800 flex items-center"><AlertTriangle className="mr-2 h-5 w-5" /> Simulation Mode Active</CardTitle></CardHeader><CardContent><p className="text-amber-700">Firebase is not configured. This page is in read-only mode and cannot load live data.</p></CardContent></Card>
      )}

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="font-headline">Inventory Report Generator</CardTitle>
          <CardDescription>Filter inventory by status and export the results.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-4 border rounded-lg mb-6 bg-muted/50 print:hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="font-semibold text-lg flex items-center col-span-full md:col-span-1"><Filter className="mr-2 h-5 w-5" /> Filters</div>
                     <div>
                        <Label htmlFor="status-filter">Status</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger id="status-filter"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {uniqueStatuses.map(status => <SelectItem key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="printable-area">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Generated Report</h3>
                    <div className="flex gap-2 print:hidden">
                        <Button onClick={handlePrint} variant="outline"><Printer className="mr-2 h-4 w-4" /> Print</Button>
                        <Button onClick={handleExportCsv}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                    </div>
                </div>

                {isLoading ? <Skeleton className="h-64 w-full" />
                 : fetchError ? <Card className="bg-destructive/10 border-destructive"><CardHeader><CardTitle className="text-base text-destructive flex items-center"><AlertCircle className="mr-2 h-5 w-5" /> Error</CardTitle></CardHeader><CardContent><p className="text-sm text-destructive">{fetchError}</p></CardContent></Card>
                 : filteredData.length === 0 ? (
                    <Card className="mt-6 bg-muted/30">
                      <CardHeader><CardTitle className="font-headline text-base flex items-center"><AlertCircle className="mr-2 h-5 w-5" />No Inventory Found</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-foreground">No inventory items match your current filter criteria.</p></CardContent>
                    </Card>
                ) : (
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader><TableRow><TableHead>Item</TableHead><TableHead className="text-right">Quantity</TableHead><TableHead className="text-right">Unit Cost</TableHead><TableHead className="text-right">Total Value</TableHead><TableHead className="text-center">Status</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {filteredData.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.item}</TableCell><TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${item.unitCost.toFixed(2)}</TableCell><TableCell className="text-right font-bold">${item.totalValue.toFixed(2)}</TableCell>
                                        <TableCell className="text-center"><Badge variant={statusVariants[item.status]} className={cn(statusVariants[item.status] === 'default' && 'bg-green-600')}>{item.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
