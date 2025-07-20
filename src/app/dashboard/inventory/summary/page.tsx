
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Building2 } from "lucide-react";
import type { PrimaryInventoryItem } from '@/lib/schemas/primaryInventory';
import { PageHeader } from '@/components/layout/page-header';

// --- SIMULATED BACKEND ---
const mockPrimaryInventoryItems: PrimaryInventoryItem[] = [
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

async function fetchPrimaryInventorySummaryFromBackend(schoolId?: string): Promise<PrimaryInventoryItem[]> {
    console.log("Simulating fetch of FULL primary inventory from backend...", { schoolId });
    await new Promise(resolve => setTimeout(resolve, 1200));
    return JSON.parse(JSON.stringify(mockPrimaryInventoryItems));
}


export default function PrimaryInventorySummaryPage() {
    const { toast } = useToast();
    const [summaryData, setSummaryData] = useState<PrimaryInventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [schoolId, setSchoolId] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        const school = localStorage.getItem('schoolId');
        setSchoolId(school);
        const loadData = async () => {
            setIsLoading(true);
            setFetchError(null);
            setLastUpdated(new Date().toLocaleString()); // Set timestamp
            try {
                const summary = await fetchPrimaryInventorySummaryFromBackend(school || undefined);
                setSummaryData(summary);
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Failed to load summary data.";
                setFetchError(msg);
                toast({ variant: "destructive", title: "Error Loading Data", description: msg });
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [toast]);

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
            
            <Card className="shadow-xl rounded-lg w-full max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">
                        Inventory Overview
                    </CardTitle>
                    <CardDescription className="font-body text-xs text-muted-foreground pt-1">
                        Last Updated: {lastUpdated}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {isLoading && (
                        <div className="space-y-4">
                            <Skeleton className="h-20 w-1/3" />
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
                    {!isLoading && !fetchError && (
                        <>
                             <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle>Total Estimated Inventory Value</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold text-primary">
                                        ${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </CardContent>
                            </Card>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Inventory Value by Item</CardTitle>
                                        <CardDescription>Visual representation of total value per item type.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="name" type="category" width={150} />
                                                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                                                <Legend />
                                                <Bar dataKey="Total Value" fill="hsl(var(--primary))" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Detailed Inventory Breakdown</CardTitle>
                                    </CardHeader>
                                    <CardContent className="max-h-[450px] overflow-y-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Item Name</TableHead>
                                                    <TableHead className="text-right">Quantity</TableHead>
                                                    <TableHead className="text-right">Value (each)</TableHead>
                                                    <TableHead className="text-right font-bold">Total Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {summaryData.map(item => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">{item.itemName}</TableCell>
                                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                                        <TableCell className="text-right">${Number(item.value).toFixed(2)}</TableCell>
                                                        <TableCell className="text-right font-bold">${((Number(item.quantity) || 0) * (Number(item.value) || 0)).toFixed(2)}</TableCell>
                                                    </TableRow>
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
