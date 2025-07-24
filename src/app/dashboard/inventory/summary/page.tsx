
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, AlertTriangle } from "lucide-react";
import type { PrimaryInventoryItem } from '@/lib/schemas/primaryInventory';
import { PageHeader } from '@/components/layout/page-header';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { collectionGroup, getDocs } from 'firebase/firestore';


async function fetchPrimaryInventorySummaryFromBackend(): Promise<PrimaryInventoryItem[]> {
    if (!db) throw new Error("Firestore is not configured.");
    const inventoryGroup = collectionGroup(db, 'primaryInventory');
    const snapshot = await getDocs(inventoryGroup);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
          id: doc.id,
          itemName: data.itemName || 'Unnamed Item',
          quantity: data.quantity || 0,
          value: data.value || 0,
          remarks: data.remarks || '',
      };
    });
}


export default function PrimaryInventorySummaryPage() {
    const { toast } = useToast();
    const [summaryData, setSummaryData] = useState<PrimaryInventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [schoolId, setSchoolId] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        setLastUpdated(new Date().toLocaleString());
        if (!isFirebaseConfigured) {
          setIsLoading(false);
          return;
        }
        try {
            const summary = await fetchPrimaryInventorySummaryFromBackend();
            setSummaryData(summary);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to load summary data.";
            setFetchError(msg);
            toast({ variant: "destructive", title: "Error Loading Data", description: msg });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        const school = localStorage.getItem('schoolId');
        setSchoolId(school);
        loadData();
    }, [loadData]);


    const chartData = useMemo(() => {
        return summaryData.map(item => ({
            name: item.itemName,
            'Total Value': (Number(item.quantity) || 0) * (Number(item.value) || 0),
        })).filter(item => item['Total Value'] > 0);
    }, [summaryData]);
    
    const totalInventoryValue = useMemo(() => {
        return summaryData.reduce((acc, item) => {
            return acc + (Number(item.quantity) || 0) * (Number(item.value) || 0);
        }, 0);
    }, [summaryData]);

    return (
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Primary School Inventory Summary"
                description={`An aggregated view of all primary school assets and their total value.${schoolId ? ` (School ID: ${schoolId})` : ''}`}
            />
            
            {!isFirebaseConfigured && (
                <Card className="bg-amber-50 border-amber-300">
                    <CardHeader><CardTitle className="font-headline text-amber-800 flex items-center"><AlertTriangle className="mr-2 h-5 w-5" /> Simulation Mode Active</CardTitle></CardHeader>
                    <CardContent><p className="text-amber-700">Firebase is not configured. This page is in read-only mode and cannot load or save data.</p></CardContent>
                </Card>
            )}
            
            <Card className="shadow-xl rounded-lg w-full max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">Inventory Overview</CardTitle>
                    <CardDescription className="font-body text-xs text-muted-foreground pt-1">Last Updated: {lastUpdated}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {isLoading && <div className="space-y-4"><Skeleton className="h-20 w-1/3" /><Skeleton className="h-64 w-full" /><Skeleton className="h-48 w-full" /></div>}
                    {fetchError && <Card className="bg-destructive/10 border-destructive"><CardHeader><CardTitle className="font-headline text-destructive flex items-center"><AlertCircle className="mr-2 h-5 w-5" /> Error</CardTitle></CardHeader><CardContent><p className="font-body text-destructive">{fetchError}</p></CardContent></Card>}
                    
                    {!isLoading && !fetchError && (
                        <>
                             <Card className="bg-muted/50">
                                <CardHeader><CardTitle>Total Estimated Inventory Value</CardTitle></CardHeader>
                                <CardContent><p className="text-4xl font-bold text-primary">${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></CardContent>
                            </Card>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card>
                                    <CardHeader><CardTitle>Inventory Value by Item</CardTitle><CardDescription>Visual representation of total value per item type.</CardDescription></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={150} /><Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} /><Legend /><Bar dataKey="Total Value" fill="hsl(var(--primary))" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle>Detailed Inventory Breakdown</CardTitle></CardHeader>
                                    <CardContent className="max-h-[450px] overflow-y-auto">
                                        <Table>
                                            <TableHeader><TableRow><TableHead>Item Name</TableHead><TableHead className="text-right">Quantity</TableHead><TableHead className="text-right">Value (each)</TableHead><TableHead className="text-right font-bold">Total Value</TableHead></TableRow></TableHeader>
                                            <TableBody>
                                                {summaryData.map(item => (
                                                    <TableRow key={item.id}><TableCell className="font-medium">{item.itemName}</TableCell><TableCell className="text-right">{item.quantity}</TableCell><TableCell className="text-right">${Number(item.value).toFixed(2)}</TableCell><TableCell className="text-right font-bold">${((Number(item.quantity) || 0) * (Number(item.value) || 0)).toFixed(2)}</TableCell></TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
