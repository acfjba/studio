
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    CheckCircle, AlertTriangle, ExternalLink, Database, Shield, DatabaseZap, Code, KeyRound, 
    Loader2, Server, CloudCog
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from 'next/link';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';
import { seedDatabase } from '@/lib/firebase/seed';


export default function FirebaseConfigPage() {
    const [projectId, setProjectId] = useState<string | null>(null);
    const [isSeeding, setIsSeeding] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // In a real app, you might fetch this from a secure backend endpoint
        // For this demo, we'll retrieve it if it was set for other pages.
        // A more robust solution would be needed for production.
        setProjectId("school-platform-kc9uh"); // Using the ID from your console link
    }, []);

    const handleSeedDatabase = async () => {
        if (!isFirebaseConfigured) {
            toast({
                variant: "destructive",
                title: "Firebase Not Configured",
                description: "Cannot seed database. Please configure your .env file.",
            });
            return;
        }

        if (!window.confirm("Are you sure you want to seed the database? This may overwrite existing data with the same IDs.")) {
            return;
        }

        setIsSeeding(true);
        toast({ title: "Seeding Database...", description: "This may take a moment. Please wait." });

        try {
            await seedDatabase();
            toast({ title: "Database Seeded Successfully", description: "Sample data has been loaded into Firestore." });
        } catch (error) {
            console.error("Error seeding database:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({ variant: "destructive", title: "Seeding Failed", description: errorMessage });
        } finally {
            setIsSeeding(false);
        }
    };
    
    const firestoreUrl = `https://console.firebase.google.com/project/${projectId}/firestore/databases/-default-/data`;
    const rulesUrl = `https://console.firebase.google.com/project/${projectId}/firestore/rules`;
    const functionsUrl = `https://console.firebase.google.com/project/${projectId}/functions`;


    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Firebase Configuration Dashboard"
                description="Monitor your Firebase connection and manage data."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Connection Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {isFirebaseConfigured ? (
                        <Alert variant="default" className="bg-green-50 border-green-200">
                             <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-800 font-bold">Successfully Connected to Firebase</AlertTitle>
                            <AlertDescription className="text-green-700">
                                The application is configured and connected to your Firebase project: <strong className="font-mono">{projectId || "Loading..."}</strong>.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Firebase Not Configured</AlertTitle>
                            <AlertDescription>
                                The application cannot connect to Firebase. Please ensure your project credentials are correctly set in the <code className="font-mono">next.config.ts</code> file.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Server className="w-5 h-5 text-primary" /> Architecture Overview
                    </CardTitle>
                    <CardDescription>
                        Understanding how your application is structured.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p>
                        This Next.js application serves as both a **frontend** (what you see in the browser) and a **backend**. The Firebase SDK allows the app to communicate directly and securely with the Firestore database for many tasks.
                    </p>
                    <p>
                        However, for sensitive operations like handling secret API keys, performing administrative tasks (like migrating users), or running scheduled jobs, a dedicated backend environment is required. For this, you would use **Firebase Cloud Functions**.
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <Database className="w-5 h-5 text-primary" /> Firestore Database
                        </CardTitle>
                        <CardDescription>
                            View and manage your live application data directly in the Firebase Console.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <a href={firestoreUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full" disabled={!projectId}>
                                Open Database <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </a>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <Shield className="w-5 h-5 text-primary" /> Security Rules
                        </CardTitle>
                        <CardDescription>
                            Define access controls and data validation for your database in the Firebase Console.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <a href={rulesUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full" disabled={!projectId}>
                                Edit Security Rules <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </a>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <CloudCog className="w-5 h-5 text-primary" /> Cloud Functions
                        </CardTitle>
                        <CardDescription>
                            For advanced backend logic, manage your serverless functions in the Firebase Console.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <a href={functionsUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full" disabled={!projectId}>
                                Manage Functions <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </a>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <DatabaseZap className="w-5 h-5 text-primary" /> Database Seeding
                    </CardTitle>
                    <CardDescription>
                           Populate your database with initial sample data for testing and demonstration.
                        </CardDescription>
                </CardHeader>
                <CardContent>
                        <Button className="w-full" onClick={handleSeedDatabase} disabled={isSeeding || !isFirebaseConfigured}>
                           {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DatabaseZap className="mr-2 h-4 w-4" />}
                           {isSeeding ? "Seeding..." : "Seed Database"}
                        </Button>
                </CardContent>
            </Card>
        </div>
    );
}
