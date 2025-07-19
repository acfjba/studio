"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, BookCheck, Users, DollarSign } from "lucide-react";

export function ReportingClient() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <BookCheck className="w-5 h-5 text-primary" /> Academic Reports
          </CardTitle>
          <CardDescription>
            Generate reports on student performance, exam results, and subject analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Generate Academic Report</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <FileBarChart className="w-5 h-5 text-primary" /> Inventory Reports
          </CardTitle>
          <CardDescription>
            View reports on stock levels, usage, and value of school inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Generate Inventory Report</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Users className="w-5 h-5 text-primary" /> Staff Reports
          </CardTitle>
          <CardDescription>
            Create reports on staff attendance, roles, and performance metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Generate Staff Report</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <DollarSign className="w-5 h-5 text-primary" /> Financial Reports
          </CardTitle>
          <CardDescription>
            Access summaries of school financials, budget tracking, and expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Generate Financial Report</Button>
        </CardContent>
      </Card>
    </div>
  );
}
