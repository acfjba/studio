"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Building } from "lucide-react";
import { staffData, schoolData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  schoolName: string;
  schoolAddress: string;
}

export function ContactsClient() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate fetching and merging data
    const mergedContacts = staffData
      .map(staff => {
        const school = schoolData.find(s => s.id === staff.schoolId);
        return {
          id: staff.id,
          name: staff.name,
          role: staff.role,
          email: staff.email,
          phone: staff.phone,
          schoolName: school?.name || 'N/A',
          schoolAddress: school?.address || 'N/A',
        };
      });
    setContacts(mergedContacts);
    setIsLoading(false);
  }, []);

  const filteredContacts = useMemo(() => {
    if (!searchTerm) return contacts;
    const lowercasedFilter = searchTerm.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(lowercasedFilter) ||
      contact.role.toLowerCase().includes(lowercasedFilter) ||
      contact.email.toLowerCase().includes(lowercasedFilter) ||
      contact.schoolName.toLowerCase().includes(lowercasedFilter)
    );
  }, [contacts, searchTerm]);

  return (
    <Card>
        <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
            <Users className="mr-3 h-7 w-7 text-primary" />
            School Contacts Directory
        </CardTitle>
        <CardDescription>
            A directory of all staff members across the schools.
        </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="mb-6">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                id="searchContacts"
                type="search"
                placeholder="Search by name, role, email, or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
            />
            </div>
        </div>

        {isLoading && (
            <div className="space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        )}

        {!isLoading && (
            <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">School</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredContacts.map(contact => (
                    <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.role}</TableCell>
                    <TableCell>
                        <div className="flex items-center">
                            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{contact.schoolName}</span>
                        </div>
                    </TableCell>
                    <TableCell><a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a></TableCell>
                    <TableCell><a href={`tel:${contact.phone}`} className="text-primary hover:underline">{contact.phone}</a></TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        )}
        { !isLoading && filteredContacts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No contacts found matching your search.</p>
        )}
        </CardContent>
    </Card>
  );
}
