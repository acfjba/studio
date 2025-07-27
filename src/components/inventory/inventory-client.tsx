
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Filter, PlusCircle, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { isFirebaseConfigured, db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';


interface InventoryItem {
    id: string;
    item: string;
    quantity: number;
    unitCost: number;
    usageRate: number;
    reorderPoint: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

async function fetchInventory(schoolId: string): Promise<InventoryItem[]> {
    if(!db) throw new Error("Firestore not configured.");
    const q = query(collection(db, 'inventory'), where('schoolId', '==', schoolId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        let status: InventoryItem['status'] = 'In Stock';
        if (data.quantity <= 0) status = 'Out of Stock';
        else if (data.quantity <= data.reorderPoint) status = 'Low Stock';
        return { id: doc.id, ...data, status } as InventoryItem;
    });
}


export function InventoryClient() {
  const [currentInventoryData, setCurrentInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string|null>(null);
  const [schoolId, setSchoolId] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    if (!schoolId) {
        if(isFirebaseConfigured) setFetchError("School ID not found.");
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setFetchError(null);
    try {
        const data = await fetchInventory(schoolId);
        setCurrentInventoryData(data);
    } catch(err) {
        setFetchError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    const id = localStorage.getItem('schoolId');
    setSchoolId(id);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const filteredData = currentInventoryData.filter(
    (item) =>
      item.item.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter.length === 0 || statusFilter.includes(item.status))
  );

  const statusVariants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    'In Stock': 'default',
    'Low Stock': 'secondary',
    'Out of Stock': 'destructive',
  };
  
  return (
    <div className="grid gap-6">
     {!isFirebaseConfigured && (
        <Card className="lg:col-span-3 bg-amber-50 border-amber-300">
            <CardHeader><CardTitle className="font-headline text-amber-800 flex items-center"><AlertTriangle className="mr-2 h-5 w-5" /> Simulation Mode Active</CardTitle></CardHeader>
            <CardContent><p className="text-amber-700">Firebase is not configured. This page is in read-only mode and cannot load or save data.</p></CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Inventory List</CardTitle>
          <CardDescription>Search and filter through your inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
             <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Quantity</TableHead><TableHead>Unit Cost</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                    <TableCell><Badge variant={statusVariants[item.status] || 'default'}>{item.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
