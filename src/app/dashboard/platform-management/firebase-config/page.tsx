
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    CheckCircle, AlertTriangle, ExternalLink, Database, KeyRound, 
    Loader2, Server, Code, DatabaseZap, Copy, TestTube2
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
import { seedDatabaseAction } from '@/app/actions';

export default function FirebaseConfigPage() {
    const [isSeeding, setIsSeeding] = useState(false);
    const [isTestingConnection, setIsTestingConnection] = useState(false);
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
            toast({
                variant: "destructive",
                title: "Firebase Not Configured",
                description: "Cannot seed database. Please configure your .env file.",
            });
            return;
        }

        if (!window.confirm("This will overwrite existing data with the same IDs. This is useful for resetting the demo data. Continue?")) {
            return;
        }

        setIsSeeding(true);
        toast({ title: "Seeding Database...", description: "This may take a moment. Please wait." });
        
        try {
            const result = await seedDatabaseAction();

            if (result.success) {
                toast({ title: "Database Seeded Successfully", description: result.message });
            } else {
                 throw new Error(result.message || 'An unknown error occurred during seeding.');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({ variant: "destructive", title: "Seeding Failed", description: errorMessage });
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

                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
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
                            After the database is created, you can use the "Seed Database" button below.
                        </AlertDescription>
                    </Alert>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline">
                                <DatabaseZap className="w-5 h-5 text-primary" /> Data Management
                            </CardTitle>
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Seeding Command (for Local Dev)</AlertTitle>
                                <AlertDescription>
                                To seed the database from your local terminal, you must first set up a service account. Download your service account key, save it as <code className="font-mono text-xs">serviceAccountKey.json</code> in the root, and set the <code className="font-mono text-xs">GOOGLE_APPLICATION_CREDENTIALS</code> environment variable to its path. Then run <code className="font-mono text-xs">npm run db:seed</code>.
                                </AlertDescription>
                            </Alert>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button className="w-full" onClick={handleSeedDatabase} disabled={isSeeding || !isFirebaseConfigured}>
                                {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DatabaseZap className="mr-2 h-4 w-4" />}
                                {isSeeding ? "Seeding..." : "Seed Database"}
                            </Button>
                        </CardContent>
                    </Card>
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
