
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    CheckCircle, AlertTriangle, ExternalLink, Database, KeyRound, 
    Loader2, Server, Code, DatabaseZap, Copy, TestTube2, ListChecks
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from 'next/link';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, doc, setDoc } from 'firebase/firestore';

interface SeedReport {
    users: string[];
    schools: string[];
    staff: string[];
    inventory: string[];
    examResults: string[];
    libraryBooks: string[];
    disciplinaryRecords: string[];
    counsellingRecords: string[];
    ohsRecords: string[];
}


export default function FirebaseConfigPage() {
    const [isSeeding, setIsSeeding] = useState(false);
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [seedReport, setSeedReport] = useState<SeedReport | null>(null);
    const { toast } = useToast();

    // State for connection keys
    const [connectionKeys, setConnectionKeys] = useState({
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        databaseId: '',
        geminiApiKey: ''
    });

    useEffect(() => {
        setConnectionKeys({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'Not Set',
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not Set',
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not Set',
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'Not Set',
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'Not Set',
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'Not Set',
            databaseId: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || '(default)',
            geminiApiKey: 'Set on Server (Hidden)',
        });
    }, []);

    const handleTestConnection = async () => {
        if (!isFirebaseConfigured || !db) {
            toast({
                variant: "destructive",
                title: "Firebase Not Configured",
                description: "Cannot test connection. Please configure your .env file.",
            });
            return;
        }

        setIsTestingConnection(true);

        toast({ title: 'Testing Connection...', description: "Attempting to write to Firestore..." });

        try {
            const testDocRef = doc(collection(db, 'test_connection'));
            await setDoc(testDocRef, {
                message: "Connection successful!",
                timestamp: new Date().toISOString(),
            });
            toast({
                title: "Connection Successful!",
                description: `Successfully wrote a document to the 'test_connection' collection in Firestore.`,
            });
        } catch (error) {
            console.error("Firestore connection test failed:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                variant: "destructive",
                title: "Connection Test Failed",
                description: `Could not write to Firestore. Check your security rules and configuration. Error: ${errorMessage}`,
            });
        } finally {
            setIsTestingConnection(false);
        }
    };
    
     const handleSeedDatabase = async () => {
        if (!isFirebaseConfigured) {
            toast({ variant: 'destructive', title: 'Action Failed', description: 'Firebase is not configured.' });
            return;
        }
        setIsSeeding(true);
        setSeedReport(null);
        toast({ title: 'Database Seeding Started', description: 'This may take a moment...' });
        
        try {
            const response = await fetch('/api/seed', { method: 'POST' });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'An unknown error occurred.');
            }
            
            toast({ title: 'Database Seeded Successfully!', description: 'Your database has been populated with sample data.' });
            setSeedReport(data.report);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
            toast({ variant: 'destructive', title: 'Database Seeding Failed', description: errorMessage });
        } finally {
            setIsSeeding(false);
        }
    };
    
    const copyToClipboard = (text: string) => {
        if(!text || text === 'Not Set' || text.includes('Hidden')) return;
        navigator.clipboard.writeText(text);
        toast({ title: "Copied to clipboard!" });
    };
    
    const firestoreUrl = connectionKeys.projectId ? `https://console.firebase.google.com/project/${connectionKeys.projectId}/firestore/databases` : '#';
    const authUrl = connectionKeys.projectId ? `https://console.firebase.google.com/project/${connectionKeys.projectId}/authentication/users` : '#';
    const functionsUrl = connectionKeys.projectId ? `https://console.firebase.google.com/project/${connectionKeys.projectId}/functions` : '#';
    const rulesUrl = connectionKeys.projectId ? `https://console.firebase.google.com/project/${connectionKeys.projectId}/firestore/rules` : '#';

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Firebase Dashboard"
                description="Monitor your Firebase connection, manage data, and access your project console."
            />

            <Tabs defaultValue="status">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="status">Status & Actions</TabsTrigger>
                    <TabsTrigger value="keys">Connection Keys</TabsTrigger>
                </TabsList>
                
                <TabsContent value="status" className="mt-6 space-y-6">
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
                                        This web application is configured to connect to your Firebase project: <strong className="font-mono">{connectionKeys.projectId || "Loading..."}</strong>.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Firebase Not Configured</AlertTitle>
                                    <AlertDescription>
                                        The application cannot connect to Firebase. Please ensure your project credentials are correctly set in the <code className="font-mono">.env</code> file.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                        <CardFooter className="flex-wrap gap-2">
                            <Button onClick={handleTestConnection} disabled={isTestingConnection || !isFirebaseConfigured} variant="outline">
                                {isTestingConnection ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube2 className="mr-2 h-4 w-4" />}
                                {isTestingConnection ? "Testing..." : "Test Firestore Connection"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline">
                                <DatabaseZap className="w-5 h-5 text-primary" /> Data Management
                            </CardTitle>
                        </CardHeader>
                         <CardContent>
                             <Alert>
                                <AlertTitle>Seed Database</AlertTitle>
                                <AlertDescription>
                                    Click the button below to populate your database with initial users, schools, and sample data. This action is idempotent, meaning you can run it multiple times without creating duplicate entries.
                                </AlertDescription>
                            </Alert>
                         </CardContent>
                         <CardFooter>
                            <Button onClick={handleSeedDatabase} disabled={isSeeding || !isFirebaseConfigured} className="w-full">
                                {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <DatabaseZap className="mr-2 h-4 w-4" />}
                                {isSeeding ? "Seeding..." : "Seed Database"}
                            </Button>
                        </CardFooter>
                    </Card>
                    
                    {seedReport && (
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline">
                                    <ListChecks className="w-5 h-5 text-primary" /> Seeding Report
                                </CardTitle>
                                <CardDescription>Summary of the data synchronization process.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                {Object.entries(seedReport).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                                        <span className="capitalize font-medium text-foreground">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className="font-bold text-primary">{Array.isArray(value) ? value.length : 'N/A'} records</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}


                    <Alert variant="destructive">
                        <AlertTitle>Important: One-Time Setup Required</AlertTitle>
                        <AlertDescription>
                            Before you can seed data, you must create a Firestore database in your Firebase project. This is a one-time setup step.
                            <br />
                            1. <a href={firestoreUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline">Click here to go to the Firestore Database page.</a>
                            <br />
                            2. Click "Create database".
                            <br />
                            3. Select **Production mode** (this is important for security rules).
                            <br />
                            4. Choose a location (e.g., us-central1) and click "Enable".
                            <br />
                            After the database is created, you can use the "Seed Database" button.
                        </AlertDescription>
                    </Alert>
                </TabsContent>
                
                <TabsContent value="keys" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Connection Keys</CardTitle>
                            <CardDescription>
                                These are the keys used to connect to Firebase and other services. They are read from your environment variables.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(connectionKeys).map(([key, value]) => (
                                <div key={key} className="space-y-1">
                                    <Label htmlFor={key} className="text-xs uppercase text-muted-foreground font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                                    <div className="flex items-center gap-2">
                                        <Input id={key} readOnly value={value || ''} className="font-mono bg-muted/50" />
                                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(value || '')} disabled={!value || value === 'Not Set' || value.includes('Hidden')}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
