
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, PackageSearch } from "lucide-react";
import type { ClassroomInventory } from '@/lib/schemas/classroom-inventory';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/layout/page-header';

// --- SIMULATED BACKEND ---

const allItemNames = [
    "Textbooks", "Exercise Books", "Pens", "Pencils", "Rulers", "Erasers",
    "Chalk / Markers", "Charts & Posters", "First Aid Kits", "Art Supplies (crayons, paper)",
    "Sports Equipment (balls, cones)", "Science Kits", "Cleaning Supplies (wipes, sanitizer)",
    "Staplers & Staples", "Paper Clips & Pins", "Globes & Maps", "Projectors & Screens", "Teacher's Guides",
    "Other Supplies"
];

// This function simulates fetching inventory data for ALL year levels.
async function fetchFullInventoryFromBackend(schoolId?: string): Promise<ClassroomInventory[]> {
    console.log("Simulating fetch of FULL inventory from backend...", { schoolId });
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Generate mock data for each year level
    const fullInventory: ClassroomInventory[] = Array.from({ length: 8 }, (_, i) => {
        const yearLevel = i + 1;
        return {
            yearLevel,
            term: "2",
            lastUpdatedBy: "system-sim",
            updatedAt: new Date().toISOString(),
            items: allItemNames.map(name => ({
                id: `item-${yearLevel}-${name.replace(/\s+/g, '-')}`,
                itemName: name,
                quantityStart: Math.floor(Math.random() * 100) + 50,
                quantityAdded: Math.floor(Math.random() * 20),
                quantityLost: Math.floor(Math.random() * 10),
                remarks: ""
            }))
        };
    });
    
    return fullInventory;
}

// --- AGGREGATION LOGIC ---

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

    useEffect(() => {
        const school = localStorage.getItem('schoolId');
        setSchoolId(school);
        const loadData = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const fullInventory = await fetchFullInventoryFromBackend(school || undefined);
                const summary = aggregateInventory(fullInventory);
                setAggregatedData(summary);
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
                {!isLoading && !fetchError && (
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
