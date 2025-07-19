
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, FileText, Printer, Download } from "lucide-react";
import { PageHeader } from '@/components/layout/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const financialData = {
    '2024': {
        revenue: [
            { source: 'School Fees', amount: 450000 },
            { source: 'Government Grants', amount: 250000 },
            { source: 'Fundraising', amount: 75000 },
            { source: 'Other Income', amount: 25000 },
        ],
        expenses: [
            { category: 'Salaries', amount: 350000 },
            { category: 'Utilities', amount: 60000 },
            { category: 'Maintenance', amount: 80000 },
            { category: 'Supplies', amount: 95000 },
            { category: 'Other', amount: 30000 },
        ],
    },
    '2023': {
        revenue: [
            { source: 'School Fees', amount: 420000 },
            { source: 'Government Grants', amount: 230000 },
            { source: 'Fundraising', amount: 60000 },
            { source: 'Other Income', amount: 20000 },
        ],
        expenses: [
            { category: 'Salaries', amount: 330000 },
            { category: 'Utilities', amount: 55000 },
            { category: 'Maintenance', amount: 70000 },
            { category: 'Supplies', amount: 90000 },
            { category: 'Other', amount: 25000 },
        ],
    }
};

const transactionData = [
    { id: 'txn1', date: '2024-07-15', description: 'Payment for Q3 Utilities', type: 'Expense', category: 'Utilities', amount: 20000 },
    { id: 'txn2', date: '2024-07-12', description: 'Received Term 3 School Fees Batch 1', type: 'Revenue', category: 'School Fees', amount: 150000 },
    { id: 'txn3', date: '2024-07-10', description: 'Purchase of Science Lab Supplies', type: 'Expense', category: 'Supplies', amount: 5500 },
    { id: 'txn4', date: '2024-07-05', description: 'Donation from Annual Fundraiser', type: 'Revenue', category: 'Fundraising', amount: 12000 },
    { id: 'txn5', date: '2024-07-01', description: 'Monthly Payroll for Staff', type: 'Expense', category: 'Salaries', amount: 29166 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function FinancialsReportPage() {
    const [selectedYear, setSelectedYear] = useState('2024');
    const { toast } = useToast();

    const currentYearData = financialData[selectedYear as keyof typeof financialData];

    const { totalRevenue, totalExpenses, netIncome } = useMemo(() => {
        const revenue = currentYearData.revenue.reduce((acc, item) => acc + item.amount, 0);
        const expenses = currentYearData.expenses.reduce((acc, item) => acc + item.amount, 0);
        return {
            totalRevenue: revenue,
            totalExpenses: expenses,
            netIncome: revenue - expenses,
        };
    }, [currentYearData]);

    const incomeVsExpenseData = [
        { name: 'Financials', Revenue: totalRevenue, Expenses: totalExpenses }
    ];

    const expenseBreakdownData = currentYearData.expenses.map(item => ({ name: item.category, value: item.amount }));

    const handlePrint = () => {
        toast({ title: "Printing Report...", description: "Use your browser's print dialog to save as PDF." });
        window.print();
    };

    const handleExport = () => {
        toast({ title: "Exporting...", description: "A CSV file of transactions has been downloaded (simulated)." });
    };

  return (
    <div className="space-y-8 printable-area">
        <PageHeader 
            title="School Financials Report"
            description="An overview of the school's financial performance."
        >
            <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
            </Select>
        </PageHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold", netIncome >= 0 ? "text-green-600" : "text-destructive")}>
                        ${netIncome.toLocaleString()}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Income vs. Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={incomeVsExpenseData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="Revenue" fill="hsl(var(--chart-2))" />
                            <Bar dataKey="Expenses" fill="hsl(var(--destructive))" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={expenseBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {expenseBreakdownData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>A log of recent financial activities.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactionData.map((txn) => (
                                <TableRow key={txn.id}>
                                    <TableCell>{txn.date}</TableCell>
                                    <TableCell className="font-medium">{txn.description}</TableCell>
                                    <TableCell>
                                        <span className={cn(txn.type === 'Revenue' ? 'text-green-600' : 'text-destructive')}>{txn.type}</span>
                                    </TableCell>
                                    <TableCell>{txn.category}</TableCell>
                                    <TableCell className={cn("text-right font-bold", txn.type === 'Revenue' ? 'text-green-600' : 'text-destructive')}>
                                        {txn.type === 'Revenue' ? '+' : '-'}${txn.amount.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end gap-4 print:hidden">
            <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export as CSV
            </Button>
            <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print Report
            </Button>
        </div>
    </div>
  );
}
