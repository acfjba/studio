
"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Eye, Trash2, FolderArchive, AlertTriangle, FileArchive, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

interface SavedDocument {
    id: string;
    name: string;
    type: string;
    dateSaved: string; // ISO String
    path: string; // e.g., "/disciplinary" or "/counselling"
}

// SIMULATED BACKEND/LOCAL STORAGE FETCH
async function fetchSavedDocuments(): Promise<SavedDocument[]> {
    console.log("Simulating fetch of saved documents...");
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        { id: 'doc1', name: 'Disciplinary Report - John Doe', type: 'Disciplinary Form', dateSaved: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), path: '/disciplinary' },
        { id: 'doc2', name: 'Counselling Notes - Jane Smith', type: 'Counselling Record', dateSaved: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), path: '/counselling' },
        { id: 'doc3', name: 'Classroom Inventory - Year 5', type: 'Inventory Report', dateSaved: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), path: '/academics/classroom-inventory' },
        { id: 'doc4', name: 'OHS Incident Report - Wet Floor', type: 'OHS Form', dateSaved: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), path: '/health-safety' },
    ];
}

export default function DocumentVaultPage() {
    const { toast } = useToast();
    const [documents, setDocuments] = useState<SavedDocument[]>([]);
    const [filteredDocuments, setFilteredDocuments] = useState<SavedDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadDocs = async () => {
            setIsLoading(true);
            try {
                const docs = await fetchSavedDocuments();
                setDocuments(docs);
                setFilteredDocuments(docs);
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Could not load saved documents." });
            } finally {
                setIsLoading(false);
            }
        };
        loadDocs();
    }, [toast]);

    useEffect(() => {
        const results = documents.filter(doc =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDocuments(results);
    }, [searchTerm, documents]);

    const handleAction = (action: string, docName: string) => {
        toast({
            title: `Action Simulated: ${action}`,
            description: `This would ${action.toLowerCase()} the document: "${docName}"`,
        });
    };
    
    const handleDelete = (docId: string) => {
        if (window.confirm("Are you sure you want to delete this document record?")) {
            setDocuments(docs => docs.filter(d => d.id !== docId));
            toast({ title: "Document record deleted." });
        }
    };
    
    const handleDownloadIndex = () => {
        if (documents.length === 0) {
            toast({ variant: "destructive", title: "No documents to export." });
            return;
        }

        const headers = ["ID", "Name", "Type", "Date Saved", "Original Path"];
        const rows = documents.map(doc => [
            doc.id,
            `"${doc.name.replace(/"/g, '""')}"`,
            `"${doc.type.replace(/"/g, '""')}"`,
            new Date(doc.dateSaved).toLocaleString(),
            doc.path,
        ]);
        
        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "document_vault_index.csv");
        document.body.appendChild(link);
        link.click();
        
        // Clean up by removing the link and revoking the object URL
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
            title: "Download Started",
            description: "The document vault index (CSV) is being downloaded."
        });
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Document Vault"
                description="Access your saved reports and forms from across the application."
            />
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="font-headline text-blue-800 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" /> How This Works
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-blue-700">
                        This page acts as a centralized log of all the documents you generate. For security, the application does not save files directly to your computer. Instead, when you "Print" or "Save" a form, a reference is saved here. You can then re-download the file anytime.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="searchDocs"
                                type="search"
                                placeholder="Search by document name or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full sm:w-80"
                            />
                        </div>
                        <Button onClick={handleDownloadIndex} disabled={isLoading || documents.length === 0}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Download Index (CSV)
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Document Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date Saved</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDocuments.length > 0 ? (
                                        filteredDocuments.map(doc => (
                                            <TableRow key={doc.id}>
                                                <TableCell className="font-medium">{doc.name}</TableCell>
                                                <TableCell>{doc.type}</TableCell>
                                                <TableCell>{new Date(doc.dateSaved).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-center space-x-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handleAction('View', doc.name)} title="View Original">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleAction('Download', doc.name)} title="Download Again">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                     <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} title="Delete Record">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                No documents found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
