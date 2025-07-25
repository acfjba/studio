
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle, AlertCircle, Wifi, Server, DatabaseZap } from "lucide-react";
import { PageHeader } from '@/components/layout/page-header';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

// --- MOCK DATA & SIMULATION ---

interface School {
    id: string;
    name: string;
}

interface SchoolStatus {
    id: string;
    name: string;
    status: 'Connected' | 'Disconnected' | 'High Latency';
    latency: number;
    dataInput: number;
    dataOutput: number;
}

async function fetchSchoolsFromFirestore(): Promise<School[]> {
    if (!db || !isFirebaseConfigured) {
        return [];
    }
    const schoolsSnapshot = await getDocs(collection(db, "schools"));
    return schoolsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
    }));
}


// Simulate fetching and dynamically updating school status
async function fetchSchoolStatuses(schools: School[]): Promise<SchoolStatus[]> {
    console.log("Simulating fetch of school statuses...");
    await new Promise(resolve => setTimeout(resolve, 800));

    return schools.map(school => {
        const random = Math.random();
        let status: SchoolStatus['status'] = 'Connected';
        let latency = Math.floor(Math.random() * 80) + 20; // 20-100ms

        if (random > 0.9) {
            status = 'Disconnected';
            latency = -1;
        } else if (random > 0.8) {
            status = 'High Latency';
            latency = Math.floor(Math.random() * 200) + 150; // 150-350ms
        }
        
        return {
            id: school.id,
            name: school.name,
            status,
            latency,
            dataInput: Math.floor(Math.random() * 5000), // in KB
            dataOutput: Math.floor(Math.random() * 10000), // in KB
        };
    });
}

export default function PlatformStatusPage() {
    const [schoolStatuses, setSchoolStatuses] = useState<SchoolStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const schools = await fetchSchoolsFromFirestore();
                if (schools.length > 0) {
                    const data = await fetchSchoolStatuses(schools);
                    setSchoolStatuses(data);
                } else {
                    setSchoolStatuses([]);
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error fetching data",
                    description: "Could not load school status information."
                });
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

        const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [toast]);

    const latencyChartData = schoolStatuses
        .filter(s => s.status !== 'Disconnected')
        .map(s => ({ name: s.id, latency: s.latency }));

    const getLatencyColor = (latency: number) => {
        if (latency > 150) return 'hsl(var(--destructive))';
        if (latency > 80) return 'hsl(var(--chart-3))';
        return 'hsl(var(--chart-2))';
    };
    
    const connectedSchools = schoolStatuses.filter(s => s.status === 'Connected').length;
    const totalSchools = schoolStatuses.length;
    const apiUptime = 99.98; // Mocked value
    const avgResponseTime = schoolStatuses.length > 0
        ? Math.round(schoolStatuses.reduce((acc, s) => acc + (s.latency > 0 ? s.latency : 0), 0) / schoolStatuses.filter(s => s.latency > 0).length)
        : 0;

    return (
        <div className="space-y-8">
            <PageHeader
                title="Platform Status & School Connectivity"
                description="Real-time analysis of school data connections and platform health."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Connected Schools</CardTitle>
                        <Wifi className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{connectedSchools} / {totalSchools}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">API Uptime</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{apiUptime}%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Latency</CardTitle>
                        <DatabaseZap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgResponseTime}ms</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>School Latency Analysis</CardTitle>
                    <CardDescription>Response time in milliseconds (ms) for each connected school.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={latencyChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => `${value}ms`}
                                    cursor={{fill: 'hsla(var(--muted), 0.5)'}}
                                />
                                <Bar dataKey="latency" name="Latency (ms)" >
                                    {latencyChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getLatencyColor(entry.latency)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Connectivity Report</CardTitle>
                    <CardDescription>Live status and data I/O for each school.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-[200px] w-full" /> : (
                        <div className="overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>School ID</TableHead>
                                        <TableHead>School Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Latency (ms)</TableHead>
                                        <TableHead className="text-right">Data In (KB)</TableHead>
                                        <TableHead className="text-right">Data Out (KB)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {schoolStatuses.map((school) => (
                                        <TableRow key={school.id}>
                                            <TableCell className="font-mono">{school.id}</TableCell>
                                            <TableCell className="font-medium">{school.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={school.status === 'Connected' ? 'default' : 'destructive'} className={cn(school.status === 'Connected' && 'bg-green-600')}>
                                                     {school.status === 'Connected' && <CheckCircle className="mr-1 h-3 w-3" />}
                                                     {school.status !== 'Connected' && <AlertCircle className="mr-1 h-3 w-3" />}
                                                    {school.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold" style={{color: getLatencyColor(school.latency)}}>
                                                {school.latency > 0 ? `${school.latency}ms` : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right">{school.dataInput.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">{school.dataOutput.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
