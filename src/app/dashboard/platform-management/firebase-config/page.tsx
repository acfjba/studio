
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    CheckCircle, AlertTriangle, ExternalLink, Database, KeyRound, 
    Loader2, Server, Code, DatabaseZap, Copy
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from 'next/link';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FirebaseConfigPage() {
    const [projectId, setProjectId] = useState<string | null>(null);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const { toast } = useToast();

    // State for connection keys
    const [connectionKeys, setConnectionKeys] = useState({
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        geminiApiKey: ''
    });

    useEffect(() => {
        const publicProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null;
        setProjectId(publicProjectId);

        setConnectionKeys({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'Not Set',
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not Set',
            projectId: publicProjectId || 'Not Set',
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'Not Set',
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'Not Set',
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'Not Set',
            geminiApiKey: process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 4)}...${process.env.GEMINI_API_KEY.slice(-4)}` : 'Not Set (Server-side)',
        });
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
            const response = await fetch('/api/seed', { method: 'POST' });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'An unknown error occurred during seeding.');
            }

            toast({ title: "Database Seeded Successfully", description: result.message });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({ variant: "destructive", title: "Seeding Failed", description: errorMessage });
        } finally {
            setIsSeeding(false);
        }
    };
    
    const handleClearData = async () => {
        if (!isFirebaseConfigured) {
            toast({ variant: "destructive", title: "Action Disabled" });
            return;
        }
        if (!window.confirm("This will delete all data in your Firestore database. This is irreversible. Are you sure?")) {
            return;
        }
        setIsClearing(true);
        toast({ title: "Clearing Database...", description: "This is a simulation. In a real app, this would be a high-privilege operation.", variant: "destructive" });
        await new Promise(res => setTimeout(res, 2000));
        toast({ title: "Database Cleared (Simulated)", description: "The database has been cleared." });
        setIsClearing(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied to clipboard!" });
    };
    
    const firestoreUrl = projectId ? `https://console.firebase.google.com/project/${projectId}/firestore/databases` : '#';
    const authUrl = projectId ? `https://console.firebase.google.com/project/${projectId}/authentication/users` : '#';
    const functionsUrl = projectId ? `https://console.firebase.google.com/project/${projectId}/functions` : '#';
    const rulesUrl = projectId ? `https://console.firebase.google.com/project/${projectId}/firestore/rules` : '#';

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
                                        This web application is configured to connect to your Firebase project: <strong className="font-mono">{projectId || "Loading..."}</strong>.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Firebase Not Configured</AlertTitle>
                                    <AlertDescription>
                                        The application cannot connect to Firebase. Please ensure your project credentials are correctly set in the <code className="font-mono">next.config.ts</code> file and that the .env file is present.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline">
                                    <Code className="w-5 h-5 text-primary" /> Frontend Connection
                                </CardTitle>
                                <CardDescription>
                                    The keys in <code className="font-mono text-xs">src/lib/firebase/config.ts</code> are for the client-side SDK.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a href={authUrl} target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full" disabled={!projectId} variant="outline">
                                        <KeyRound className="mr-2 h-4 w-4" /> Manage Users
                                    </Button>
                                </a>
                                <a href={rulesUrl} target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full" disabled={!projectId} variant="outline">
                                        <Database className="mr-2 h-4 w-4" /> Manage Security Rules
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline">
                                    <Server className="w-5 h-5 text-primary" /> Backend Connection
                                </CardTitle>
                                <CardDescription>
                                A secure backend connection with admin rights is handled by <strong className="text-foreground">Firebase App Hosting</strong>.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <a href={functionsUrl} target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full" disabled={!projectId}>
                                        Manage Cloud Functions <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline">
                                <DatabaseZap className="w-5 h-5 text-primary" /> Data Management
                            </CardTitle>
                            <CardDescription>
                                Use these actions to manage the data in your Firestore database.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button className="w-full" onClick={handleSeedDatabase} disabled={isSeeding || !isFirebaseConfigured}>
                                {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DatabaseZap className="mr-2 h-4 w-4" />}
                                {isSeeding ? "Seeding..." : "Seed Database"}
                            </Button>
                            <Button className="w-full" onClick={handleClearData} disabled={isClearing || !isFirebaseConfigured} variant="destructive">
                                {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DatabaseZap className="mr-2 h-4 w-4" />}
                                {isClearing ? "Clearing..." : "Clear All Data (Simulated)"}
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
                                        <Input id={key} readOnly value={value} className="font-mono bg-muted/50" />
                                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(value)}>
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
