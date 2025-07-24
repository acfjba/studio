
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, PackageSearch, AlertTriangle } from "lucide-react";
import type { ClassroomInventory } from '@/lib/schemas/classroom-inventory';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/layout/page-header';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { collectionGroup, getDocs } from 'firebase/firestore';


async function fetchFullInventoryFromBackend(schoolId: string): Promise<ClassroomInventory[]> {
    if (!db) throw new Error("Firestore is not configured.");
    // This is an advanced query that gets all documents from any subcollection named 'classroomInventory'
    // It requires a composite index in Firestore to work across all schools for a system-admin.
    // For a school admin, we'd add a where() clause.
    const inventoryGroup = collectionGroup(db, 'classroomInventory');
    const snapshot = await getDocs(inventoryGroup);
    return snapshot.docs.map(doc => doc.data() as ClassroomInventory);
}


interface AggregatedItem {
    name: string;
    start: number;
    added: number;
    lost: number;
    current: number;
    netChange: number;
}

const aggregateInventory = (fullInventory: ClassroomInventory[]): AggregatedItem[] => {
    const summary = new Map<string, { start: number; added: number; lost: number }>();

    for (const yearInventory of fullInventory) {
        for (const item of yearInventory.items) {
            const totals = summary.get(item.itemName) || { start: 0, added: 0, lost: 0 };
            totals.start += Number(item.quantityStart) || 0;
            totals.added += Number(item.quantityAdded) || 0;
            totals.lost += Number(item.quantityLost) || 0;
            summary.set(item.itemName, totals);
        }
    }
    
    return Array.from(summary.entries()).map(([name, data]) => {
        const current = data.start + data.added - data.lost;
        const netChange = data.added - data.lost;
        return { name, ...data, current, netChange };
    });
};


export default function InventorySummaryPage() {
    const { toast } = useToast();
    const [aggregatedData, setAggregatedData] = useState<AggregatedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [schoolId, setSchoolId] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!schoolId) {
            if (isFirebaseConfigured) setFetchError("School ID not found.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setFetchError(null);
        try {
            const fullInventory = await fetchFullInventoryFromBackend(schoolId);
            const summary = aggregateInventory(fullInventory);
            setAggregatedData(summary);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to load summary data.";
            setFetchError(msg);
            toast({ variant: "destructive", title: "Error Loading Data", description: msg });
        } finally {
            setIsLoading(false);
        }
    }, [schoolId, toast]);

    useEffect(() => {
        const id = localStorage.getItem('schoolId');
        setSchoolId(id);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const chartData = useMemo(() => {
        return aggregatedData.map(item => ({
            name: item.name.split(' ')[0], // Shorten label for chart
            'Current Stock': item.current,
        }));
    }, [aggregatedData]);

    const netChangeChartData = useMemo(() => {
        return aggregatedData
            .filter(item => item.netChange !== 0) // Only show items with changes
            .map(item => ({
                name: item.name.split(' ')[0],
                netChange: item.netChange,
            }));
    }, [aggregatedData]);

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Classroom Inventory Summary"
                description={`An aggregated view of all classroom stock across all year levels. ${schoolId ? ` (School ID: ${schoolId})` : ''}`}
            />
             {!isFirebaseConfigured && (
                <Card className="bg-amber-50 border-amber-300">
                    <CardHeader>
                        <CardTitle className="font-headline text-amber-800 flex items-center">
                            <AlertTriangle className="mr-2 h-5 w-5" /> Simulation Mode Active
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-amber-700">
                            Firebase is not configured. This page is in read-only mode and cannot save or load live data.
                        </p>
                    </CardContent>
                </Card>
            )}
            <div className="space-y-8">
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                )}
                {fetchError && (
                    <Card className="bg-destructive/10 border-destructive">
                        <CardHeader><CardTitle className="font-headline text-destructive flex items-center"><AlertCircle className="mr-2 h-5 w-5" /> Error</CardTitle></CardHeader>
                        <CardContent><p className="font-body text-destructive">{fetchError}</p></CardContent>
                    </Card>
                )}
                {!isLoading && !fetchError && aggregatedData.length === 0 && (
                    <Card className="flex items-center justify-center min-h-[400px]">
                        <CardContent className="text-center">
                            <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-medium">No Inventory Data</h3>
                            <p className="mt-1 text-sm text-muted-foreground">No classroom inventory has been recorded for this school yet.</p>
                        </CardContent>
                    </Card>
                )}
                {!isLoading && !fetchError && aggregatedData.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Current Stock Levels</CardTitle>
                                    <CardDescription>Visual representation of current inventory.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={12} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="Current Stock" fill="hsl(var(--primary))" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Net Change in Stock</CardTitle>
                                    <CardDescription>Changes in inventory levels over the term (Added - Lost).</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={netChangeChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={12} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="netChange" name="Net Change">
                                            {netChangeChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.netChange >= 0 ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))'} />
                                            ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Detailed Inventory Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item Name</TableHead>
                                                <TableHead className="text-right">Total at Term Start</TableHead>
                                                <TableHead className="text-right">Total Added</TableHead>
                                                <TableHead className="text-right">Total Lost/Damaged</TableHead>
                                                <TableHead className="text-right">Net Change</TableHead>
                                                <TableHead className="text-right font-bold">Total Current Stock</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {aggregatedData.map(item => (
                                                <TableRow key={item.name}>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell className="text-right">{item.start}</TableCell>
                                                    <TableCell className="text-right text-green-600">+{item.added}</TableCell>
                                                    <TableCell className="text-right text-destructive">-{item.lost}</TableCell>
                                                    <TableCell className={cn("text-right font-bold", item.netChange > 0 ? "text-green-600" : item.netChange < 0 ? "text-destructive" : "text-muted-foreground")}>
                                                        {item.netChange > 0 ? `+${item.netChange}` : item.netChange}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold">{item.current}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
