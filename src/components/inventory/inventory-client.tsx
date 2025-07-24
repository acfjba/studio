
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, Filter, PlusCircle, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { forecastInventoryNeeds, type ForecastInventoryNeedsOutput } from '@/ai/flows/forecast-inventory-needs';
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


const forecastSchema = z.object({
  forecastMonths: z.coerce.number().min(1).max(24),
  desiredConfidenceLevel: z.coerce.number().min(0.1).max(0.99),
});

export function InventoryClient() {
  const [currentInventoryData, setCurrentInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string|null>(null);
  const [schoolId, setSchoolId] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [forecastResult, setForecastResult] = useState<ForecastInventoryNeedsOutput | null>(null);
  const [isForecasting, setIsForecasting] = useState(false);
  const { toast } = useToast();

  const forecastForm = useForm<z.infer<typeof forecastSchema>>({
    resolver: zodResolver(forecastSchema),
    defaultValues: { forecastMonths: 6, desiredConfidenceLevel: 0.85 },
  });

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

  const handleForecast = async (values: z.infer<typeof forecastSchema>) => {
    setIsForecasting(true);
    setForecastResult(null);
    if (currentInventoryData.length === 0) {
        toast({ variant: 'destructive', title: 'Error', description: 'No inventory data to forecast.'});
        setIsForecasting(false);
        return;
    }
    try {
      const result = await forecastInventoryNeeds({
        ...values,
        inventoryData: currentInventoryData.map(({id, status, ...rest}) => rest),
      });
      setForecastResult(result);
    } catch (error) {
      console.error('Forecasting failed:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate forecast. Please try again.'});
    } finally {
      setIsForecasting(false);
    }
  };

  const statusVariants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    'In Stock': 'default',
    'Low Stock': 'secondary',
    'Out of Stock': 'destructive',
  };
  
  return (
    <div className="grid gap-6 lg:grid-cols-3">
     {!isFirebaseConfigured && (
        <Card className="lg:col-span-3 bg-amber-50 border-amber-300">
            <CardHeader><CardTitle className="font-headline text-amber-800 flex items-center"><AlertTriangle className="mr-2 h-5 w-5" /> Simulation Mode Active</CardTitle></CardHeader>
            <CardContent><p className="text-amber-700">Firebase is not configured. This page is in read-only mode and cannot load or save data.</p></CardContent>
        </Card>
      )}
      <Card className="lg:col-span-2">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={(checked) => {
                      setStatusFilter((prev) =>
                        checked ? [...prev, status] : prev.filter((s) => s !== status)
                      );
                    }}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Inventory Forecasting</CardTitle>
          <CardDescription>Use AI to predict future inventory needs.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={forecastForm.handleSubmit(handleForecast)} className="space-y-4">
            <div>
              <label htmlFor="forecastMonths" className="text-sm font-medium">Forecast Period (Months)</label>
              <Input id="forecastMonths" type="number" {...forecastForm.register('forecastMonths')} />
            </div>
            <div>
              <label htmlFor="desiredConfidenceLevel" className="text-sm font-medium">Confidence Level</label>
              <Input id="desiredConfidenceLevel" type="number" step="0.05" {...forecastForm.register('desiredConfidenceLevel')} />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="submit" className="w-full" disabled={isForecasting}>
                  {isForecasting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Forecasting...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Forecast</>}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader><DialogTitle className="font-headline">AI Forecast Results</DialogTitle><DialogDescription>Projected needs and recommendations for the next {forecastForm.getValues('forecastMonths')} months.</DialogDescription></DialogHeader>
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {isForecasting && <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                {!isForecasting && forecastResult && (
                    <Table>
                        <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Projected Need</TableHead><TableHead>Cost Savings</TableHead><TableHead>Recommendation</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {forecastResult.map((item) => (
                                <TableRow key={item.item}>
                                    <TableCell className="font-medium">{item.item}</TableCell><TableCell>{item.projectedNeed}</TableCell>
                                    <TableCell>${item.estimatedCostSavings.toFixed(2)}</TableCell><TableCell>{item.reorderRecommendation}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {!isForecasting && !forecastResult && <p className="text-center text-muted-foreground py-10">Generate a forecast to see results.</p>}
                </div>
              </DialogContent>
            </Dialog>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
